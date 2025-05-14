ALTER TABLE community.invitation DROP CONSTRAINT IF EXISTS fk_invitation_inviter;
DROP INDEX IF EXISTS community.idx_invitation_inviter;
ALTER TABLE community.invitation DROP COLUMN IF EXISTS inviter_id;

ALTER TABLE community.user DROP CONSTRAINT IF EXISTS user_ent_id_unique;
ALTER TABLE community.user DROP COLUMN IF EXISTS ent_id;
ALTER TABLE community.user DROP COLUMN IF EXISTS display_name;