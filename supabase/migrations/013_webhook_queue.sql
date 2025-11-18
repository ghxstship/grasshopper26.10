-- =====================================================
-- WEBHOOK QUEUE SYSTEM
-- Queue and track webhook deliveries
-- =====================================================

-- Webhook queue table
CREATE TABLE IF NOT EXISTS webhook_queue (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    event_type TEXT NOT NULL,
    payload JSONB NOT NULL,
    url TEXT NOT NULL,
    headers JSONB DEFAULT '{}'::jsonb,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    last_attempt_at TIMESTAMPTZ,
    next_retry_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for webhook queue
CREATE INDEX IF NOT EXISTS idx_webhook_queue_status ON webhook_queue(status);
CREATE INDEX IF NOT EXISTS idx_webhook_queue_next_retry ON webhook_queue(next_retry_at) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_webhook_queue_event_type ON webhook_queue(event_type);
CREATE INDEX IF NOT EXISTS idx_webhook_queue_created ON webhook_queue("createdAt" DESC);

-- Webhook delivery log
CREATE TABLE IF NOT EXISTS webhook_delivery_log (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    webhook_id TEXT NOT NULL REFERENCES webhook_queue(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    status_code INTEGER,
    response_body TEXT,
    response_headers JSONB,
    duration_ms INTEGER,
    error TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_webhook_log_webhook ON webhook_delivery_log(webhook_id);
CREATE INDEX IF NOT EXISTS idx_webhook_log_created ON webhook_delivery_log("createdAt" DESC);

-- Function to enqueue webhook
CREATE OR REPLACE FUNCTION enqueue_webhook(
    p_event_type TEXT,
    p_payload JSONB,
    p_url TEXT,
    p_headers JSONB DEFAULT '{}'::jsonb,
    p_max_retries INTEGER DEFAULT 3
)
RETURNS TEXT AS $$
DECLARE
    v_webhook_id TEXT;
BEGIN
    INSERT INTO webhook_queue (event_type, payload, url, headers, max_retries, next_retry_at)
    VALUES (p_event_type, p_payload, p_url, p_headers, p_max_retries, NOW())
    RETURNING id INTO v_webhook_id;
    
    RETURN v_webhook_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark webhook as processing
CREATE OR REPLACE FUNCTION mark_webhook_processing(p_webhook_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE webhook_queue
    SET status = 'processing',
        last_attempt_at = NOW(),
        retry_count = retry_count + 1,
        "updatedAt" = NOW()
    WHERE id = p_webhook_id
    AND status = 'pending';
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Function to mark webhook as completed
CREATE OR REPLACE FUNCTION mark_webhook_completed(
    p_webhook_id TEXT,
    p_status_code INTEGER,
    p_response_body TEXT DEFAULT NULL,
    p_duration_ms INTEGER DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    UPDATE webhook_queue
    SET status = 'completed',
        completed_at = NOW(),
        "updatedAt" = NOW()
    WHERE id = p_webhook_id;
    
    INSERT INTO webhook_delivery_log (webhook_id, attempt_number, status_code, response_body, duration_ms)
    SELECT id, retry_count, p_status_code, p_response_body, p_duration_ms
    FROM webhook_queue
    WHERE id = p_webhook_id;
END;
$$ LANGUAGE plpgsql;

-- Function to mark webhook as failed and schedule retry
CREATE OR REPLACE FUNCTION mark_webhook_failed(
    p_webhook_id TEXT,
    p_error TEXT,
    p_status_code INTEGER DEFAULT NULL
)
RETURNS void AS $$
DECLARE
    v_retry_count INTEGER;
    v_max_retries INTEGER;
    v_next_retry TIMESTAMPTZ;
BEGIN
    SELECT retry_count, max_retries INTO v_retry_count, v_max_retries
    FROM webhook_queue
    WHERE id = p_webhook_id;
    
    -- Log the failed attempt
    INSERT INTO webhook_delivery_log (webhook_id, attempt_number, status_code, error)
    VALUES (p_webhook_id, v_retry_count, p_status_code, p_error);
    
    -- Check if we should retry
    IF v_retry_count < v_max_retries THEN
        -- Exponential backoff: 2^retry_count minutes
        v_next_retry := NOW() + (POWER(2, v_retry_count) || ' minutes')::INTERVAL;
        
        UPDATE webhook_queue
        SET status = 'pending',
            next_retry_at = v_next_retry,
            error_message = p_error,
            "updatedAt" = NOW()
        WHERE id = p_webhook_id;
    ELSE
        -- Max retries reached, mark as failed
        UPDATE webhook_queue
        SET status = 'failed',
            error_message = p_error,
            "updatedAt" = NOW()
        WHERE id = p_webhook_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get pending webhooks
CREATE OR REPLACE FUNCTION get_pending_webhooks(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
    id TEXT,
    event_type TEXT,
    payload JSONB,
    url TEXT,
    headers JSONB,
    retry_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wq.id,
        wq.event_type,
        wq.payload,
        wq.url,
        wq.headers,
        wq.retry_count
    FROM webhook_queue wq
    WHERE wq.status = 'pending'
    AND (wq.next_retry_at IS NULL OR wq.next_retry_at <= NOW())
    ORDER BY wq."createdAt"
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED;
END;
$$ LANGUAGE plpgsql;

-- Cleanup old webhook logs (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_webhook_logs()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM webhook_delivery_log
    WHERE "createdAt" < NOW() - INTERVAL '30 days';
    
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;

-- Cleanup completed webhooks (keep last 7 days)
CREATE OR REPLACE FUNCTION cleanup_completed_webhooks()
RETURNS INTEGER AS $$
DECLARE
    v_deleted INTEGER;
BEGIN
    DELETE FROM webhook_queue
    WHERE status = 'completed'
    AND completed_at < NOW() - INTERVAL '7 days';
    
    GET DIAGNOSTICS v_deleted = ROW_COUNT;
    RETURN v_deleted;
END;
$$ LANGUAGE plpgsql;
