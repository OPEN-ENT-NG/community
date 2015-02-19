begin transaction
MATCH (g:CommunityGroup) SET g:Visible;
commit
