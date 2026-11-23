// All content lives here so it is easy to edit.
// `lenient` = how many years under the rating still gets "Okay with guidance".
// Set it to 0 to make a rating strict (PEGI 18 is strict by default).

const base = import.meta.env.BASE_URL

export const GAME_RATINGS = [
  {
    id: 3,
    age: 3,
    badge: `${base}pegi/pegi-3.png`,
    color: '#a5c600',
    short: 'Suitable for all ages',
    lenient: 0,
    summary:
      'Content is considered suitable for all age groups. A very mild form of violence is allowed only in a comical or child-friendly setting. No bad language.',
    expect: [
      'Cartoon-style or comical violence only',
      'Nothing that could frighten young children',
      'No bad language, no sexual content',
    ],
    descriptors: ['In-game purchases (some)', 'Online play (some)'],
    examples: ['Mario Kart 8 Deluxe', 'Animal Crossing: New Horizons', 'EA Sports FC'],
    law: 'In the UK, PEGI 3 is advisory. Shops are not legally restricted from selling it.',
    tip: 'Safe for most young children, but check for in-game purchases and online chat.',
  },
  {
    id: 7,
    age: 7,
    badge: `${base}pegi/pegi-7.png`,
    color: '#a5c600',
    short: 'May include mild content',
    lenient: 1,
    summary:
      'May contain some scenes or sounds that could frighten younger children. Mild, non-realistic or implied violence is allowed.',
    expect: [
      'Frightening scenes or sounds for very young children',
      'Mild violence that is implied or not realistic',
      'Fantasy characters in conflict, nothing graphic',
    ],
    descriptors: ['Fear', 'Mild violence', 'In-game purchases (some)'],
    examples: ['Minecraft', 'Pokémon Scarlet / Violet', 'Sonic games'],
    law: 'In the UK, PEGI 7 is advisory. Shops are not legally restricted from selling it.',
    tip: 'A good fit for early primary-age children. Sit with them the first time if they scare easily.',
  },
  {
    id: 12,
    age: 12,
    badge: `${base}pegi/pegi-12.png`,
    color: '#f5a100',
    short: 'May include more realistic violence',
    lenient: 1,
    summary:
      'Video games that show violence of a slightly more graphic nature towards fantasy characters, or non-realistic violence towards human-like characters. Mild bad language and sexual innuendo can appear.',
    expect: [
      'More graphic violence towards fantasy characters',
      'Non-realistic violence towards human-like characters',
      'Mild bad language and sexual innuendo',
      'Simulated gambling in some games',
    ],
    descriptors: ['Violence', 'Bad language (mild)', 'Sex (innuendo)', 'Gambling (simulated)'],
    examples: ['Fortnite', 'The Legend of Zelda: Breath of the Wild', 'Overwatch 2'],
    law: 'In the UK, PEGI 12 is legally enforced: shops cannot sell it to under-12s. Parents can still allow play at home.',
    tip: 'Look at the content descriptors on the box. Online play usually means chatting with strangers.',
  },
  {
    id: 16,
    age: 16,
    badge: `${base}pegi/pegi-16.png`,
    color: '#f5a100',
    short: 'May include strong violence',
    lenient: 1,
    summary:
      'Applies when the depiction of violence or sexual activity reaches a stage that looks the same as it would in real life. Stronger bad language and the use of tobacco, alcohol or illegal drugs can appear.',
    expect: [
      'Realistic-looking violence towards human characters',
      'Sexual activity (not explicit)',
      'Strong bad language',
      'Use of tobacco, alcohol or illegal drugs',
      'Criminal activity',
    ],
    descriptors: ['Violence', 'Bad language', 'Sex', 'Drugs', 'Gambling'],
    examples: ['Halo Infinite', 'Apex Legends', 'Battlefield 1'],
    law: 'In the UK, PEGI 16 is legally enforced: shops cannot sell it to under-16s.',
    tip: 'Online shooters at this level often have open voice chat. Check the privacy and chat settings.',
  },
  {
    id: 18,
    age: 18,
    badge: `${base}pegi/pegi-18.png`,
    color: '#e2001a',
    short: 'Adults only',
    lenient: 0,
    summary:
      'The level of violence is gross violence, apparently motiveless killing, or violence towards defenceless characters. Glamorisation of illegal drugs, discrimination and explicit sexual activity can also appear.',
    expect: [
      'Gross, graphic or motiveless violence',
      'Violence towards helpless characters',
      'Explicit sex or nudity in some games',
      'Glamorisation of illegal drug use',
      'Discrimination and extreme themes',
    ],
    descriptors: ['Violence', 'Bad language', 'Sex', 'Drugs', 'Discrimination', 'Gambling'],
    examples: ['Grand Theft Auto V', 'Call of Duty: Modern Warfare', 'Resident Evil Village'],
    law: 'In the UK, PEGI 18 is legally enforced: shops cannot sell it to under-18s.',
    tip: 'This is a hard line. The content is aimed at adults, so there is no “nearly old enough”.',
  },
]

export const SOCIAL_APPS = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    icon: `${base}apps/whatsapp.webp`,
    age: 13,
    lenient: 0,
    short: 'Messaging and group chats',
    summary:
      'Private messaging, voice and video calls, and group chats. Anyone with your phone number can message you unless you change your settings.',
    expect: ['Private and group chats with contacts', 'Voice and video calls', 'Status updates and shared media', 'Messages are end-to-end encrypted'],
    watch: ['Large group chats can include people your child does not know', 'Shared photos and links spread quickly'],
    controls: ['Set “Who can add me to groups” to My contacts', 'Limit who sees profile photo, About and last seen', 'Turn on disappearing messages only if you are comfortable with it'],
    tip: 'Agree which groups are fine to join, and how to leave a group that gets nasty.',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: `${base}apps/instagram.webp`,
    age: 13,
    lenient: 0,
    short: 'Photos, reels and DMs',
    summary:
      'Photo and short-video sharing with a public or private profile, direct messages and an algorithm-driven feed.',
    expect: ['Photos, Stories and Reels', 'Direct messages', 'Likes, follower counts and comparison', 'Suggested content from people you do not follow'],
    watch: ['Appearance and popularity pressure', 'Messages from strangers on public accounts'],
    controls: ['Use a private account', 'Check Instagram’s Teen Account settings', 'Limit DMs and tagging to people they follow'],
    tip: 'Under-18 accounts get extra default protections, but check the settings together.',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: `${base}apps/facebook.webp`,
    age: 13,
    lenient: 0,
    short: 'Friends, groups and feed',
    summary:
      'A social network built around friends, family, groups, pages and a news feed. Used less by teens than it used to be.',
    expect: ['Friend lists and news feed', 'Public and private groups', 'Marketplace and pages', 'Ads and recommended posts'],
    watch: ['Friend requests from strangers', 'Public posts that can be found by anyone', 'Misinformation and scams'],
    controls: ['Set posts to Friends instead of Public', 'Review who can send friend requests', 'Turn on profile and tag review'],
    tip: 'Messenger has its own parental supervision tools if they use it.',
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: `${base}apps/snapchat.webp`,
    age: 13,
    lenient: 0,
    short: 'Disappearing photos and chats',
    summary:
      'Photo and video messages that usually disappear after viewing, with Stories, streaks and a map that can show where friends are.',
    expect: ['Disappearing snaps and chats', 'Streaks that pressure daily use', 'Snap Map location sharing', 'Spotlight and Discover content'],
    watch: ['Disappearing messages make bullying harder to prove', 'Location sharing on Snap Map', 'Friend suggestions from strangers'],
    controls: ['Set Snap Map to Ghost Mode', 'Limit who can contact you to Friends', 'Use Family Center to see their friends list'],
    tip: 'Screenshots are possible, so “disappearing” does not mean “private”.',
  },
  {
    id: 'x',
    name: 'X',
    icon: `${base}apps/x.webp`,
    age: 13,
    lenient: 0,
    short: 'Public posts and news',
    summary:
      'A fast public feed of short posts, news, memes and arguments. Content moderation is lighter than most apps, and adult content is allowed.',
    expect: ['Public posts, replies and reposts', 'Breaking news and trending topics', 'Adult and graphic content can appear', 'Heated arguments and pile-ons'],
    watch: ['Sensitive or graphic media in the feed', 'Strangers replying to public posts', 'Misinformation'],
    controls: ['Protect posts so only followers see them', 'Turn off sensitive content in settings', 'Mute words and limit who can reply'],
    tip: 'Of the apps here, this one has the least filtering, so it needs the most conversation.',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: `${base}apps/tiktok.webp`,
    age: 13,
    lenient: 0,
    short: 'Short videos and live streams',
    summary:
      'An endless feed of short videos picked by an algorithm, with comments, duets, messaging and live streams.',
    expect: ['A personalised “For You” feed', 'Trends, challenges and filters', 'Comments, duets and DMs', 'Live streams and gifts'],
    watch: ['Hours disappear quickly', 'Risky challenges and body-image content', 'Strangers in comments and live chats'],
    controls: ['Use Family Pairing to link accounts', 'Set screen-time limits and restricted mode', 'Make the account private'],
    tip: 'Family Pairing lets you set daily time limits and restrict who can message them.',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: `${base}apps/youtube.webp`,
    age: 13,
    lenient: 0,
    short: 'Videos, Shorts and comments',
    summary:
      'The biggest video site in the world. Anyone can watch without an account, but having your own account needs you to be 13+ in the UK. Younger children can use a supervised account set up by a parent.',
    expect: ['Videos of every kind, from learning to gaming', 'Short vertical videos (Shorts)', 'Comments and live chat', 'Autoplay and recommended videos'],
    watch: ['Recommendations can drift to unsuitable videos', 'Comments can be unkind or inappropriate', 'Autoplay makes it easy to lose track of time'],
    controls: ['Use a supervised experience through Family Link for younger children', 'Turn on Restricted Mode', 'Turn off autoplay and set a bedtime reminder'],
    tip: 'Watch a few of their favourite channels together. It shows you what the algorithm is feeding them.',
  },
  {
    id: 'youtubekids',
    name: 'YouTube Kids',
    icon: `${base}apps/youtubekids.webp`,
    age: 0,
    ageLabel: 'Under 13',
    maxAge: 12,
    lenient: 0,
    short: 'Made for children under 13',
    summary:
      'A separate app made for children. It has simpler controls, filtered videos and tools for parents. It is not perfect, but it is much safer than the main YouTube app for young children.',
    expect: ['Child-friendly videos, songs and cartoons', 'Profiles by age: Preschool, Younger and Older', 'Large buttons and simple search', 'Ads between some videos'],
    watch: ['Filters are automatic, so a few unsuitable videos can still slip through', 'Adverts and promoted toys', 'Children can outgrow it and want the main app'],
    controls: ['Choose the right age profile', 'Use “Approved content only” for the youngest children', 'Set a timer and turn search off'],
    tip: 'Around 12 or 13 many children want the main YouTube app. Move them across with a supervised account.',
  },
  {
    id: 'discord',
    name: 'Discord',
    icon: `${base}apps/discord.webp`,
    age: 13,
    lenient: 0,
    short: 'Servers, voice chat and DMs',
    summary:
      'A chat app built around communities called servers, with text channels, voice chat and direct messages. Popular with gamers. Some servers are public and full of strangers.',
    expect: ['Servers with different channels', 'Voice and video chat while gaming', 'Direct messages and group chats', 'Some adult-only servers and channels'],
    watch: ['Strangers can message you from shared servers', 'Adult-only channels exist', 'Moderation depends on each server'],
    controls: ['Turn on the safe direct messaging filter', 'Limit friend requests to friends of friends or nobody', 'Use Family Center to see their servers and friends'],
    tip: 'Ask them which servers they are in. Small servers run by people they know are the safest.',
  },
]

export function judge(age, item) {
  const gap = item.age - age
  if (gap <= 0) return 'good'
  if (gap <= item.lenient) return 'guidance'
  return 'no'
}

export const DESCRIPTORS = [
  { name: 'Violence', text: 'The game contains depictions of violence. The higher the age rating, the more realistic or graphic it gets.' },
  { name: 'Bad language', text: 'The game contains swearing. Mild language appears at PEGI 12, strong language from PEGI 16.' },
  { name: 'Fear', text: 'The game may be frightening or scary for younger children.' },
  { name: 'Sex', text: 'The game contains sexual innuendo, sexual posturing or sexual activity. Explicit content is PEGI 18.' },
  { name: 'Drugs', text: 'The game refers to or depicts the use of illegal drugs, alcohol or tobacco.' },
  { name: 'Discrimination', text: 'The game contains material that may encourage discrimination. This is always PEGI 18.' },
  { name: 'Gambling', text: 'The game encourages or teaches gambling, including simulated gambling with no real money.' },
  { name: 'In-game purchases', text: 'The game offers the option to spend real money on extras such as loot boxes, currency or upgrades.' },
  { name: 'Online play', text: 'Shown as a notice: the game can be played online, which may include chat with other players.' },
]
