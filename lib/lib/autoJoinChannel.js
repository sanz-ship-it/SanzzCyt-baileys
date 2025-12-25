/**
 * Auto Join WhatsApp Channel
 * Added by: Sanz
 * Forked from: kiuur/baileys
 */

export async function autoJoinChannel(sock, channelJid) {
  if (!channelJid) throw new Error("Channel JID required")

  try {
    await sock.newsletterFollow("120363423571146260@newsletter")
    console.log("[AUTO JOIN CHANNEL] Joined:", channelJid)
    return true
  } catch (err) {
    console.error("[AUTO JOIN CHANNEL] Failed:", err)
    return false
  }
}
