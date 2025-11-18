-- =====================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- Automated database operations
-- =====================================================

-- Function: Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables with updatedAt column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Calculate order total
CREATE OR REPLACE FUNCTION calculate_order_total(order_id TEXT)
RETURNS DECIMAL AS $$
DECLARE
    total DECIMAL;
BEGIN
    SELECT COALESCE(SUM(price * quantity), 0)
    INTO total
    FROM order_items
    WHERE "orderId" = order_id;
    
    RETURN total;
END;
$$ LANGUAGE plpgsql;

-- Function: Update ticket counts on event
CREATE OR REPLACE FUNCTION update_event_ticket_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE events
        SET "ticketsSold" = "ticketsSold" + 1
        WHERE id = NEW."eventId";
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE events
        SET "ticketsSold" = GREATEST("ticketsSold" - 1, 0)
        WHERE id = OLD."eventId";
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_event_tickets_on_insert
    AFTER INSERT ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_event_ticket_counts();

CREATE TRIGGER update_event_tickets_on_delete
    AFTER DELETE ON tickets
    FOR EACH ROW EXECUTE FUNCTION update_event_ticket_counts();

-- Function: Update social post counts
CREATE OR REPLACE FUNCTION update_social_post_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        IF TG_TABLE_NAME = 'social_comments' THEN
            UPDATE social_posts
            SET "commentsCount" = "commentsCount" + 1
            WHERE id = NEW."postId";
        ELSIF TG_TABLE_NAME = 'social_likes' THEN
            UPDATE social_posts
            SET "likesCount" = "likesCount" + 1
            WHERE id = NEW."postId";
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        IF TG_TABLE_NAME = 'social_comments' THEN
            UPDATE social_posts
            SET "commentsCount" = GREATEST("commentsCount" - 1, 0)
            WHERE id = OLD."postId";
        ELSIF TG_TABLE_NAME = 'social_likes' THEN
            UPDATE social_posts
            SET "likesCount" = GREATEST("likesCount" - 1, 0)
            WHERE id = OLD."postId";
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_post_comments_count
    AFTER INSERT OR DELETE ON social_comments
    FOR EACH ROW EXECUTE FUNCTION update_social_post_counts();

CREATE TRIGGER update_post_likes_count
    AFTER INSERT OR DELETE ON social_likes
    FOR EACH ROW EXECUTE FUNCTION update_social_post_counts();

-- Function: Update user follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE users
        SET "followersCount" = "followersCount" + 1
        WHERE id = NEW."followingId";
        
        UPDATE users
        SET "followingCount" = "followingCount" + 1
        WHERE id = NEW."followerId";
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE users
        SET "followersCount" = GREATEST("followersCount" - 1, 0)
        WHERE id = OLD."followingId";
        
        UPDATE users
        SET "followingCount" = GREATEST("followingCount" - 1, 0)
        WHERE id = OLD."followerId";
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_follow_counts
    AFTER INSERT OR DELETE ON follows
    FOR EACH ROW EXECUTE FUNCTION update_follower_counts();

-- Function: Update budget spent amount
CREATE OR REPLACE FUNCTION update_budget_spent()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE budgets
        SET spent = (
            SELECT COALESCE(SUM(amount), 0)
            FROM expenses
            WHERE "budgetId" = NEW."budgetId"
            AND status = 'APPROVED'
        )
        WHERE id = NEW."budgetId";
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE budgets
        SET spent = (
            SELECT COALESCE(SUM(amount), 0)
            FROM expenses
            WHERE "budgetId" = OLD."budgetId"
            AND status = 'APPROVED'
        )
        WHERE id = OLD."budgetId";
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_budget_on_expense_change
    AFTER INSERT OR UPDATE OR DELETE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_budget_spent();

-- Function: Validate event capacity
CREATE OR REPLACE FUNCTION validate_event_capacity()
RETURNS TRIGGER AS $$
DECLARE
    event_capacity INTEGER;
    tickets_sold INTEGER;
BEGIN
    SELECT capacity, "ticketsSold"
    INTO event_capacity, tickets_sold
    FROM events
    WHERE id = NEW."eventId";
    
    IF tickets_sold >= event_capacity THEN
        RAISE EXCEPTION 'Event is sold out';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_event_capacity
    BEFORE INSERT ON tickets
    FOR EACH ROW EXECUTE FUNCTION validate_event_capacity();

-- Function: Generate QR code on ticket creation
CREATE OR REPLACE FUNCTION generate_ticket_qr()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."qrCode" IS NULL THEN
        NEW."qrCode" = 'QR-' || NEW.id || '-' || EXTRACT(EPOCH FROM CURRENT_TIMESTAMP)::TEXT;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_ticket_qr_code
    BEFORE INSERT ON tickets
    FOR EACH ROW EXECUTE FUNCTION generate_ticket_qr();

-- Function: Update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE wallets
        SET balance = balance + NEW.amount
        WHERE id = NEW."walletId";
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wallet_on_transaction
    AFTER INSERT ON wallet_transactions
    FOR EACH ROW EXECUTE FUNCTION update_wallet_balance();

-- Function: Soft delete (archive) instead of hard delete
CREATE OR REPLACE FUNCTION soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME IN ('events', 'projects', 'tasks') THEN
        UPDATE events SET "deletedAt" = CURRENT_TIMESTAMP WHERE id = OLD.id AND TG_TABLE_NAME = 'events';
        UPDATE projects SET "deletedAt" = CURRENT_TIMESTAMP WHERE id = OLD.id AND TG_TABLE_NAME = 'projects';
        UPDATE tasks SET "deletedAt" = CURRENT_TIMESTAMP WHERE id = OLD.id AND TG_TABLE_NAME = 'tasks';
        RETURN NULL;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;
