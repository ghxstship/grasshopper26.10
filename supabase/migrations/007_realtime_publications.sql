-- =====================================================
-- REALTIME PUBLICATIONS
-- Enable real-time subscriptions for live updates
-- =====================================================

-- Create publication for realtime changes
CREATE PUBLICATION supabase_realtime FOR ALL TABLES;

-- Enable realtime for specific tables
ALTER PUBLICATION supabase_realtime ADD TABLE users;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE social_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE social_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE social_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE follows;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
ALTER PUBLICATION supabase_realtime ADD TABLE tickets;
ALTER PUBLICATION supabase_realtime ADD TABLE orders;
ALTER PUBLICATION supabase_realtime ADD TABLE cart_items;
ALTER PUBLICATION supabase_realtime ADD TABLE advancing_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE projects;
ALTER PUBLICATION supabase_realtime ADD TABLE qr_scans;
ALTER PUBLICATION supabase_realtime ADD TABLE check_ins;
ALTER PUBLICATION supabase_realtime ADD TABLE wallet_transactions;

-- Enable replica identity for realtime updates
ALTER TABLE users REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;
ALTER TABLE social_posts REPLICA IDENTITY FULL;
ALTER TABLE social_comments REPLICA IDENTITY FULL;
ALTER TABLE social_likes REPLICA IDENTITY FULL;
ALTER TABLE follows REPLICA IDENTITY FULL;
ALTER TABLE events REPLICA IDENTITY FULL;
ALTER TABLE tickets REPLICA IDENTITY FULL;
ALTER TABLE orders REPLICA IDENTITY FULL;
ALTER TABLE cart_items REPLICA IDENTITY FULL;
ALTER TABLE advancing_requests REPLICA IDENTITY FULL;
ALTER TABLE tasks REPLICA IDENTITY FULL;
ALTER TABLE projects REPLICA IDENTITY FULL;
ALTER TABLE qr_scans REPLICA IDENTITY FULL;
ALTER TABLE check_ins REPLICA IDENTITY FULL;
ALTER TABLE wallet_transactions REPLICA IDENTITY FULL;
