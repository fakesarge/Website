// Owner Discord ID — only this account has admin access
// Replace with your Discord user ID (right-click your profile in Discord → Copy User ID)
export const OWNER_DISCORD_ID = "REPLACE_WITH_YOUR_DISCORD_ID";

// Check if a Discord ID is the owner
export const isOwner = (discordId: string | null | undefined): boolean => {
  if (!discordId) return false;
  return discordId === OWNER_DISCORD_ID;
};
