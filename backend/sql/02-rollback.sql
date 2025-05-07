ALTER TABLE community.invitation DROP CONSTRAINT IF EXISTS fk_invitation_inviter;
DROP INDEX IF EXISTS community.idx_invitation_inviter;
ALTER TABLE community.invitation DROP COLUMN IF EXISTS inviter_id;

ALTER TABLE community.users DROP CONSTRAINT IF EXISTS users_ent_id_unique;
ALTER TABLE community.users DROP COLUMN IF EXISTS ent_id;
ALTER TABLE community.users DROP COLUMN IF EXISTS display_name;