-- =====================================================
-- NOTIFICATION QUEUE SYSTEM
-- Queue and batch process notifications
-- =====================================================

-- Notification queue for batch processing
CREATE TABLE IF NOT EXISTS notification_queue (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}'::jsonb,
    channels TEXT[] DEFAULT ARRAY['in_app']::TEXT[], -- in_app, email, sms, push
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
    scheduled_for TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notification_queue_user ON notification_queue("userId");
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status);
CREATE INDEX IF NOT EXISTS idx_notification_queue_scheduled ON notification_queue(scheduled_for) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_notification_queue_priority ON notification_queue(priority, scheduled_for);

-- Function to enqueue notification
CREATE OR REPLACE FUNCTION enqueue_notification(
    p_user_id TEXT,
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_data JSONB DEFAULT '{}'::jsonb,
    p_channels TEXT[] DEFAULT ARRAY['in_app']::TEXT[],
    p_priority TEXT DEFAULT 'normal',
    p_scheduled_for TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TEXT AS $$
DECLARE
    v_notification_id TEXT;
BEGIN
    INSERT INTO notification_queue ("userId", type, title, message, data, channels, priority, scheduled_for)
    VALUES (p_user_id, p_type, p_title, p_message, p_data, p_channels, p_priority, p_scheduled_for)
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to batch enqueue notifications
CREATE OR REPLACE FUNCTION batch_enqueue_notifications(
    p_user_ids TEXT[],
    p_type TEXT,
    p_title TEXT,
    p_message TEXT,
    p_data JSONB DEFAULT '{}'::jsonb,
    p_channels TEXT[] DEFAULT ARRAY['in_app']::TEXT[],
    p_priority TEXT DEFAULT 'normal'
)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    INSERT INTO notification_queue ("userId", type, title, message, data, channels, priority)
    SELECT 
        unnest(p_user_ids),
        p_type,
        p_title,
        p_message,
        p_data,
        p_channels,
        p_priority;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get pending notifications
CREATE OR REPLACE FUNCTION get_pending_notifications(p_limit INTEGER DEFAULT 100)
RETURNS TABLE (
    id TEXT,
    "userId" TEXT,
    type TEXT,
    title TEXT,
    message TEXT,
    data JSONB,
    channels TEXT[],
    priority TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        nq.id,
        nq."userId",
        nq.type,
        nq.title,
        nq.message,
        nq.data,
        nq.channels,
        nq.priority
    FROM notification_queue nq
    WHERE nq.status = 'pending'
    AND nq.scheduled_for <= NOW()
    ORDER BY 
        CASE nq.priority
            WHEN 'urgent' THEN 1
            WHEN 'high' THEN 2
            WHEN 'normal' THEN 3
            WHEN 'low' THEN 4
        END,
        nq.scheduled_for
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED;
END;
$$ LANGUAGE plpgsql;

-- Function to mark notification as sent
CREATE OR REPLACE FUNCTION mark_notification_sent(p_notification_id TEXT)
RETURNS void AS $$
BEGIN
    UPDATE notification_queue
    SET status = 'sent',
        sent_at = NOW(),
        "updatedAt" = NOW()
    WHERE id = p_notification_id;
    
    -- Create in-app notification record
    INSERT INTO notifications ("userId", type, title, message, data, "createdAt")
    SELECT "userId", type, title, message, data, NOW()
    FROM notification_queue
    WHERE id = p_notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark notification as failed
CREATE OR REPLACE FUNCTION mark_notification_failed(
    p_notification_id TEXT,
    p_error TEXT
)
RETURNS void AS $$
DECLARE
    v_retry_count INTEGER;
    v_max_retries INTEGER;
BEGIN
    SELECT retry_count, max_retries INTO v_retry_count, v_max_retries
    FROM notification_queue
    WHERE id = p_notification_id;
    
    IF v_retry_count < v_max_retries THEN
        -- Schedule retry with exponential backoff
        UPDATE notification_queue
        SET status = 'pending',
            retry_count = retry_count + 1,
            scheduled_for = NOW() + (POWER(2, retry_count) || ' minutes')::INTERVAL,
            error_message = p_error,
            "updatedAt" = NOW()
        WHERE id = p_notification_id;
    ELSE
        -- Max retries reached
        UPDATE notification_queue
        SET status = 'failed',
            error_message = p_error,
            "updatedAt" = NOW()
        WHERE id = p_notification_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to cleanup old notifications
CREATE OR REPLACE FUNCTION cleanup_old_notification_queue()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM notification_queue
    WHERE status IN ('sent', 'failed')
    AND "updatedAt" < NOW() - INTERVAL '7 days';
    
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-enqueue notification on certain events
CREATE OR REPLACE FUNCTION auto_enqueue_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Example: Enqueue notification when ticket is transferred
    IF TG_TABLE_NAME = 'tickets' AND NEW.status = 'TRANSFERRED' AND OLD.status != 'TRANSFERRED' THEN
        PERFORM enqueue_notification(
            NEW."userId",
            'ticket_transferred',
            'Ticket Transferred',
            'Your ticket has been successfully transferred.',
            jsonb_build_object('ticketId', NEW.id, 'eventId', NEW."eventId"),
            ARRAY['in_app', 'email']::TEXT[],
            'normal'
        );
    END IF;
    
    -- Example: Enqueue notification when order is completed
    IF TG_TABLE_NAME = 'orders' AND NEW.status = 'COMPLETED' AND OLD.status != 'COMPLETED' THEN
        PERFORM enqueue_notification(
            NEW."userId",
            'order_completed',
            'Order Completed',
            'Your order has been completed successfully.',
            jsonb_build_object('orderId', NEW.id, 'total', NEW.total),
            ARRAY['in_app', 'email']::TEXT[],
            'normal'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers (examples)
CREATE TRIGGER ticket_notification_trigger
    AFTER UPDATE ON tickets
    FOR EACH ROW
    EXECUTE FUNCTION auto_enqueue_notification();

CREATE TRIGGER order_notification_trigger
    AFTER UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION auto_enqueue_notification();
