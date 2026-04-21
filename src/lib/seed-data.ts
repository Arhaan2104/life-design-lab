import { v4 as uuid } from "uuid";
import type { Entry } from "./types";
import { getDb, listEntries, addPhoto, updateEntry } from "./db";

/** Map entry index → image filenames in public/ to auto-attach */
const ENTRY_PHOTOS: Record<number, string[]> = {
  0: ["IMG_3447.jpg", "IMG_4907.jpg"],         // dog story
  1: ["IMG_3510.jpg"],                          // late night room
  2: ["IMG_4116.jpg"],                          // CoralEHR product
  4: ["4FB89B3D-88B7-4ACE-BE29-272CAB3937FD.JPG"], // cafe working
  5: ["IMG_3617.jpg"],                          // mixer with friends
  8: ["IMG_2A5285A5-3F7F-4B98-9208-9D5C6D8C8E15.JPEG", "IMG_5255.jpg"], // football injuries
  9: ["IMG_4222.jpg", "IMG_4651.jpg"],          // gym + cooking
  10: ["IMG_3854.jpg", "b8ccf660-186e-450c-a8d2-c64790160de1.JPG"], // climbing + group
};

const SEED_ENTRIES: Omit<Entry, "id" | "createdAt" | "updatedAt">[] = [
  // ── Weeks 1–2 ─────────────────────────────────────────────────────
  {
    date: "2026-01-27",
    title: "Before the semester even started",
    awareness:
      "This is not really a class reflection yet because the semester has barely begun, but I want to write it down because it set the tone for everything that followed. Right before classes started, my dog was attacked and badly bitten. It was traumatic. Not in a dramatic retelling way, just in the way where you spend a week not thinking about anything else. I was at the vet constantly, cleaning wounds, watching him to make sure he was eating and not in too much pain. For about a week my entire world shrank to just taking care of him.\n\nWhat I noticed during that week is how quickly everything else stopped mattering. CoralEHR, graduation plans, career anxiety, all of it just went quiet. The only thing that was real was this animal that needed me. My friends kept checking in through the whole thing  - messages, calls, a couple of them came over just to sit with me while I was stressed. That mattered more than I expected. I think that told me something about what actually matters to me versus what I think matters to me. The urgent real thing will always override the ambitious abstract thing. And the people who show up during those moments  - that is real too.",
    creativeProblemSolving:
      "The reframe, if I can even call it that this early, is about presence. I spent the whole break before this semester thinking about the future, planning, stressing about what comes after graduation. Then this happened and I was forced into being completely present for a week. And honestly, being present felt better than planning. Not because planning is bad, but because I realized how much of my anxiety comes from living in a future that does not exist yet.\n\nFrom a design thinking perspective, maybe the takeaway is that I need to prototype the present, not just the future. Life design is not only about where you are going. It is also about how you are showing up right now.",
    biasToAction:
      "Practically, the week of taking care of my dog became a kind of mental reset. By the time I actually walked into class, I felt calmer and more grounded than I expected. Not because the anxiety about the future disappeared, but because the dog situation reminded me that I can handle hard things when they actually happen. I do not need to pre-worry about everything.\n\nI also used the quiet of that week to mentally prep for this last semester. I made a short list of what I actually want out of these final months: go deeper on CoralEHR, learn properly, finish strong enough academically, and stop treating my body like it is optional. Nothing revolutionary, but writing it down made it feel more real. Next step: actually start the semester with that list in mind instead of just reacting to whatever shows up.",
    photoIds: [],
  },
  {
    date: "2026-01-30",
    title: "Running on less than I think",
    awareness:
      "I have been sleeping inconsistently and I think I have been pretending it does not matter. This week I woke up at 6am two days in a row after going to bed past 2, and both times I just pushed through the day. By evening I was bloated, dehydrated, low energy, and my thinking was noticeably worse. I caught myself reaching for caffeine not because I wanted it but because I needed it to feel baseline functional.\n\nThe thing I noticed is that I treat my body like it is separate from my work. As if my ability to think clearly about product design or write good copy for CoralEHR has nothing to do with whether I slept or drank water. That is obviously not true but I act like it is.",
    creativeProblemSolving:
      "In the Good Time Journal exercise we did in class, I tracked my energy and engagement for a few days. What stood out was that my best thinking consistently happens in the late morning after a decent sleep  - not at 1am when I am technically \"in the zone\" but actually just wired. The engagement is high at night but the quality drops off. So the assumption I challenged was: late nights are when I do my best work. The data says otherwise.\n\nThe design thinking move is to treat this like a prototype. Instead of overhauling my entire schedule, just try one thing and see what happens.",
    biasToAction:
      "I set an alarm for midnight this week as a \"start winding down\" signal  - not a hard bedtime, just a nudge. Three out of five days I actually followed it, and the two mornings after good sleep I got more done before noon than I usually do in an entire evening session. Small sample but it felt real.\n\nI also started carrying a water bottle around instead of only drinking when I remember to. Sounds trivial but I was genuinely dehydrated most days. Next step: keep the midnight alarm going for another two weeks and actually track whether my output quality changes.",
    photoIds: [],
  },

  // ── Weeks 3–4 ─────────────────────────────────────────────────────
  {
    date: "2026-02-05",
    title: "Caring this much is scary",
    awareness:
      "Something I felt strongly this week: the more I care about CoralEHR, the more the possibility of it failing scares me. That sounds obvious when I write it down, but I had not really sat with it before. I have been framing the startup in my head as this rational bet  - good market, real problem, I have the skills to build it. But underneath that framing there is something much less rational. I actually care about this. Not just intellectually. It matters to me in a way that makes me vulnerable.\n\nI think the fear is not really about the startup failing. It is about what it would mean about me if it did. Which is a much harder thing to deal with.",
    creativeProblemSolving:
      "The design thinking reframe is about separating identity from outcome. One of the things we keep coming back to in class is that life design is not about finding the one right answer  - it is about generating options and prototyping. If I apply that to CoralEHR, the startup is a prototype. A serious, deeply committed prototype, but still one version of what my life could look like. It does not have to carry the weight of defining who I am.\n\nThat does not mean I care less. It means I can care deeply and still not collapse if things go sideways. The reframe is: I am not my startup. I am the person building it.",
    biasToAction:
      "I started writing out the actual value proposition for CoralEHR this week  - not marketing copy, but the real explanation of what we are building and why. AI-native clinical workspace for behavioral health clinicians, focused on private-pay and out-of-network practices. The message is something like: care, not claims. Meaning the software is shaped around the clinical relationship, not around insurance billing.\n\nI also spent time thinking about how to explain the AI layer without it sounding like every other startup that slaps \"AI\" on everything. The positioning needs to be careful  - AI as a support layer, not a replacement for clinical judgment. Next step: share the positioning doc with two people I trust and get honest feedback by end of next week.",
    photoIds: [],
  },
  {
    date: "2026-02-09",
    title: "The Odyssey Plan exercise",
    awareness:
      "We did the Odyssey Plan in class this week and it hit harder than I expected. I had to map out three different versions of my life over the next five years. The first one was obvious  - go all in on CoralEHR, raise funding, build the company. The second was: get a design engineer role at a startup, build skills and runway, maybe come back to my own thing later. The third was the weird one  - I wrote a version where I take a year off after graduation, travel, build random things, no pressure.\n\nWhat I noticed is that versions two and three both made me feel slightly sad. Not because they were bad lives, but because they felt like settling. And I think that tells me something about how strongly I already feel about the first path, even if I do not always admit it.",
    creativeProblemSolving:
      "The interesting reframe from the Odyssey Plan is that the three lives are not ranked  - they are all supposed to be genuinely good. But I could not make myself believe that. I kept writing versions two and three as lesser alternatives. The facilitator pointed out that if you cannot make all three plans genuinely exciting, you might be too attached to one identity.\n\nSo the challenge is: can I hold the ambition of plan one while being genuinely open to the possibility that a different path could also be meaningful? I do not think I am there yet. But naming the attachment is a start.",
    biasToAction:
      "After the Odyssey Plan, I did something I had been avoiding. I actually looked at design engineer roles  - remote positions at US and UK startups. Not to apply immediately, but to understand what is out there and what skills they want. I found a few that genuinely interested me, not as backup plans but as roles I could see myself learning from.\n\nI also realized that the best version of a backup plan is not a random safe job  - it is something that builds toward the same direction. A design engineer role at a health tech company, for example, would build relevant skills and connections. Next step: shortlist five roles that align with where I want to end up regardless of which Odyssey path I take.",
    photoIds: [],
  },

  // ── Weeks 5–6 ─────────────────────────────────────────────────────
  {
    date: "2026-02-18",
    title: "The runway question",
    awareness:
      "Graduation is getting close and the practical questions are getting louder. How long can I sustain myself financially if I go full-time on CoralEHR? What if funding takes six months? What if it takes a year? I noticed this week that I have been avoiding doing the actual math because I am scared of what the numbers will say.\n\nThere is a version of me that wants to just leap and figure it out. And there is another version that knows leaping without a plan is how people end up stuck. I think the tension between those two versions is actually the most honest thing I have felt this semester. Neither one is wrong. They just both exist at the same time.",
    creativeProblemSolving:
      "The reframe I am working with is that backup planning is not the opposite of commitment  - it is a form of design. In Life Design, we talk about how prototyping reduces risk without reducing ambition. A backup plan is the same thing. It is not me giving up on CoralEHR. It is me making sure I can keep working on CoralEHR for as long as possible without running out of money.\n\nI think the assumption I was holding was that having a backup means I do not believe in the main thing enough. But actually, the founders I respect most are the ones who were strategic about runway. They did not just hope. They designed their path.",
    biasToAction:
      "I sat down and actually did the math on my financial runway. It was uncomfortable but necessary. I have enough savings to sustain myself for a few months post-graduation if I am careful. That is not a lot, but it is not nothing.\n\nBased on that, I started thinking about what a lean outbound strategy for jobs would look like  - not mass applications, but targeted emails to founders and startup people. The idea is to keep the job-search effort as small as possible so it does not eat into CoralEHR time. I drafted a list of ten people I could reach out to, mostly founders and YC folks. Next step: send the first three emails this week.",
    photoIds: [],
  },
  {
    date: "2026-02-25",
    title: "Something shifted with CoralEHR",
    awareness:
      "This week was insane and I need to write about it because I think something actually changed. I went to the India AI Summit to see Sam Altman and Vinod Khosla speak. Then the same week there was an Ashoka mixer. I went to the mixer with a couple of friends on zero sleep  - I had been awake for about 40 hours straight because I had to finish work, then the summit, and then the mixer back to back. I was running on nothing. Honestly, my friends are the reason I even showed up. They were going and basically dragged me along. I owe them for that.\n\nAt the mixer I met this guy Ritvik Sharma from All In VC. We got talking about CoralEHR and he was genuinely interested. Not in a polite networking way, but in a \"tell me more about the clinical workflow problem\" way. That conversation, at a mixer I almost did not go to because I was so exhausted, might be one of the most important conversations I have had this semester. We are now in actual talks with All In.\n\nWhat I noticed is that CoralEHR stopped feeling like a side project in that moment. Someone with real money and real conviction looked at what I was building and took it seriously. That does something to you. It is not just validation  - it is a shift in how real the whole thing feels.",
    creativeProblemSolving:
      "The reframe here is about showing up even when conditions are not perfect. I almost did not go to that mixer. I was running on no sleep, I looked rough, I was not in \"networking mode.\" Every rational part of my brain said go home and sleep. But I went anyway because something in me said this matters.\n\nFrom a Life Design perspective, this connects to prototype conversations  - the idea that you cannot predict which conversation will change your trajectory. You just have to keep putting yourself in rooms. The 40-hour no-sleep version of me at that mixer was not polished or prepared. But he was there. And that was enough.\n\nThe design thinking takeaway: stop waiting for optimal conditions. The most important moments of this semester have come from showing up imperfectly.",
    biasToAction:
      "Since meeting Ritvik, we have moved into actual conversations with All In VC about CoralEHR. I spent the rest of the week tightening the landing page  - reworking the hero section and CTA strategy, deciding between book a demo versus free trial. Went with book a demo because the product is not at a self-serve stage yet.\n\nI also started writing out the positioning properly. Not marketing fluff, but the real explanation: AI-native clinical workspace for behavioral health, focused on private-pay and out-of-network clinicians. Care, not claims. The positioning needs to be sharp because now there are real people looking at it, not just me staring at my own website.\n\nNext step: get the positioning doc to a state I can share with Ritvik and the All In team. This is no longer theoretical. There is an actual conversation happening and I need to be ready for it.",
    photoIds: [],
  },

  // ── Weeks 7–8 ─────────────────────────────────────────────────────
  {
    date: "2026-03-04",
    title: "Wanting to actually be good",
    awareness:
      "I had a moment this week where I was working on the CoralEHR interface and I realized I was making design decisions based on instinct without actually understanding the principles behind them. The spacing looked right, the colors felt right, but if someone asked me why I chose a 16px gap instead of 12px, I would not have a real answer. Just vibes.\n\nThat bothered me more than it used to. I think something has shifted in how I see myself. I do not just want to be someone who makes things that look good. I want to understand what I am doing at a deeper level. The difference between a designer who has taste and a design engineer who has taste plus understanding  - I want to be the second one.",
    creativeProblemSolving:
      "The assumption I challenged is that instinct is enough. For a while I have operated on the belief that if something looks right, it is right. And honestly, that has gotten me pretty far. But it has also created a ceiling. When I try to explain my decisions or teach them to someone else, I cannot. That means my skill is fragile  - it works when it works, but I cannot debug it when it does not.\n\nThe design thinking reframe is to treat my own skill development as a prototype. Instead of trying to become a complete design engineer overnight, pick one area  - say, typography  - and go deep. Learn the fundamentals. Then move to the next thing. Build understanding layer by layer instead of trying to absorb everything at once.",
    biasToAction:
      "I started studying design systems properly this week. Not just browsing Dribbble or copying Tailwind templates, but actually reading about spacing scales, type hierarchies, and color theory. I spent time understanding why certain component libraries make the decisions they do.\n\nI also started paying more attention to the frontend architecture side  - how design tokens work, how to structure CSS so it scales, where the boundary between design and engineering actually sits. This is not just academic. It directly applies to CoralEHR because the product needs a design system that can grow. Next step: build a basic design token file for CoralEHR by end of next week.",
    photoIds: [],
  },
  {
    date: "2026-03-09",
    title: "The gap between appearing and being",
    awareness:
      "I had a conversation with someone this week who asked me what kind of role I see myself in long-term. I said \"design engineer\" almost automatically. But then they asked what that actually means to me, and I stumbled. I could describe the outputs  - shipping polished products fast, bridging design and code  - but I could not articulate the depth behind it.\n\nWhat I noticed is that there is a gap between the identity I project and the understanding I actually have. I can ship things. I can make things look good. I can move fast with AI-assisted tools. But some of that speed comes from skipping steps I probably should not be skipping. The foundation is not as solid as the surface suggests.",
    creativeProblemSolving:
      "The reframe from Life Design is about gravity problems versus anchor problems. A gravity problem is something you cannot change  - like the fact that I did not study computer science formally or start coding at age twelve. An anchor problem is something you can change but are avoiding  - like actually learning the fundamentals instead of just relying on instinct and tools.\n\nMy lack of formal CS background is a gravity problem. I need to stop wishing I had it. But my lack of depth in design and frontend engineering  - that is an anchor problem. I can absolutely fix it. I have been treating it like a gravity problem because learning fundamentals is slower and less exciting than shipping features. But it is solvable. I just have to choose to do it.",
    biasToAction:
      "I committed to a learning rhythm this week: every morning before I start working on CoralEHR, I spend 30 minutes on fundamentals. This week it was CSS layout and Tailwind internals  - understanding what the utility classes actually compile to, not just using them.\n\nI also started reading about backend concepts that I have been treating as a black box  - how APIs are structured, what happens between the frontend and the database. Not to become a backend engineer, but to stop feeling like half of the system I am building is magic I do not understand. Next step: keep the 30-minute learning habit going for the rest of the month and track what I actually cover.",
    photoIds: [],
  },

  // ── Weeks 9–10 ─────────────────────────────────────────────────────
  {
    date: "2026-03-18",
    title: "The machine has limits",
    awareness:
      "Football has been intense lately and my body has been letting me know. Tight calves, shin pain, some visible abrasions from tackles. I play with the same group of friends every week and honestly those games are one of the best parts of my life right now  - it is the one place where I am not thinking about startups or graduation or any of it. Just running and competing with people I genuinely love being around. But I have been playing through everything because that is what you do, and this week I noticed that the soreness was affecting my focus. I sat down to work on the CoralEHR dashboard and I could not think clearly for the first hour. Not because of a mental block  - because my body was just tired.\n\nI also noticed that I have been asking a lot of questions about recovery  - whether sprays and ointments actually help, how much sleep I actually need, what to eat before and after games. The fact that I am asking these questions means I already know I have been winging it.",
    creativeProblemSolving:
      "The assumption I was holding: I can push my body hard and my mental work will be unaffected. The evidence says no. The days I play football and do not recover properly, my design work suffers. Not dramatically, but enough that I can feel the difference.\n\nThe reframe is about sustainability as a design constraint, not an afterthought. In product design, constraints are what make things better  - you work within them, not against them. My body is a constraint. Sleep, hydration, recovery  - these are not interruptions to the real work. They are the infrastructure that makes the real work possible. If I was designing a product, I would never ignore the infrastructure. But I have been doing exactly that with myself.",
    biasToAction:
      "I started being more deliberate about pre-game and post-game routines. Proper warm-ups instead of just jogging onto the pitch. Stretching after instead of collapsing on the couch. Hydrating before I feel thirsty. I also stopped pretending that one puff of anything the night before a game does not matter  - it does, especially for my breathing and recovery.\n\nOn the work side, I started blocking the morning after football for lighter tasks  - emails, reading, planning  - instead of trying to do deep design work when my body is still recovering. That small scheduling change made a noticeable difference. Next step: keep this going and actually track whether my output quality correlates with recovery quality.",
    photoIds: [],
  },
  {
    date: "2026-03-23",
    title: "Samarth and the health thing",
    awareness:
      "I visited my childhood best friend Samarth in the US recently and something about seeing him really stuck with me. During COVID he put on a lot of weight  - was almost 120 kilos. After his first year of college, he completely locked in. Not just gym and weight loss, but being intentional about everything  - what he eats, not just the calories but the actual ingredients, the really bad stuff you do not even think about. He looks and feels like a completely different person.\n\nI have always been a fit guy, more or less. I put on 20 kilos in 2022 but lost it and have been on-and-off with the gym since. But because I do not gain weight easily, I never really watched what I ate. I just assumed being not-fat meant being healthy. Watching Samarth made me realize how low my bar actually was. He was not just maintaining  - he was building. I was just coasting.",
    creativeProblemSolving:
      "The reframe is about the difference between passive fitness and intentional health. I have been passively fit  - I do not look out of shape, I play football, I can get through a day. But I have not been intentional about any of it. What Samarth showed me is that being intentional changes everything, not just your body but your energy, your mood, your discipline in other areas.\n\nFrom a Life Design perspective, this connects to something we talked about in class  - that the way you do one thing is often the way you do everything. If I am coasting on my health, where else am I coasting? That question is uncomfortable but I think it is the right one to ask.",
    biasToAction:
      "Since coming back from seeing Samarth, I have made some real changes. I returned to the gym consistently  - not just going when I feel like it, but actually following a schedule. More importantly, I started eating intentionally. Not just \"healthy\" in a vague sense, but actually paying attention to what is in my food, cutting out the stuff that is obviously bad, eating enough protein, and cooking more instead of ordering.\n\nIt has only been a few weeks but I already feel different. More energy, better sleep, clearer thinking. The compound effect of gym plus nutrition plus hydration is much bigger than any of those things alone. Next step: keep this going. The goal is not a transformation  - it is building a baseline that I can maintain while everything else in my life is demanding.",
    photoIds: [],
  },

  // ── Weeks 11–12 ────────────────────────────────────────────────────
  {
    date: "2026-04-02",
    title: "University is ending and I can feel it",
    awareness:
      "Something shifted this week that is hard to describe. University does not just feel like it is ending administratively  - it feels like it is ending emotionally. I caught myself walking across campus and thinking this might be one of the last times I do this. Not in a dramatic way, just in a noticing way.\n\nThe thing that hits hardest is the people. My friends here  - the ones I play football with, the ones I stay up too late talking to, the ones who have been there through every anxious spiral and every small win  - we are not going to be in the same place anymore. We went rock climbing together this week and it felt different. Like we were all quietly aware that this version of us, the version that can just do things together on a Tuesday, has an expiration date. I am there for them a lot and they are there for me just as much. That is not something I am going to find again easily.\n\nI also realized I have been mentally checked out of coursework for weeks. My real energy goes to CoralEHR, to thinking about my future, to the gym and football and recovery. University has become the thing I do between the things I actually care about. That feels a bit ungrateful to say, but it is honest. And I think being honest about it is better than pretending I am equally invested in everything.",
    creativeProblemSolving:
      "The Life Design reframe is that transitions are not endings  - they are design opportunities. The end of university is not something happening to me. It is a transition I get to design. What do I want to carry forward? What am I glad to leave behind? What relationships, habits, and ways of thinking are worth keeping?\n\nI think the tendency is to either romanticize what is ending or rush toward what is next. The design thinking move is to do neither  - just be present with the transition and notice what it is teaching me about what I actually value. The things I will miss tell me something. The things I will not miss also tell me something.",
    biasToAction:
      "I started a small list this week: things I want to make sure I do before graduation. Not bucket-list stuff, but intentional things  - conversations I want to have with friends, people I want to thank properly, places on campus I want to sit one more time. It sounds sentimental but it is actually practical. I do not want to look back and realize I sleepwalked through the ending.\n\nOn the CoralEHR side, I had my first conversation with a clinician who currently uses a competing EHR system. She described her daily workflow and I took detailed notes. The friction points she described are exactly what we are trying to solve. That conversation made the product feel more real and more urgent. Next step: synthesize the conversation notes into actual feature priorities.",
    photoIds: [],
  },
  {
    date: "2026-04-07",
    title: "Designing the next chapter",
    awareness:
      "I have been thinking about what it means to design a life instead of falling into one. That phrase has come up in class all semester, but this week it landed differently. I think for most of university I was living reactively  - doing the next thing that was expected, meeting deadlines, showing up where I was supposed to be. The last few months have been the first time I have genuinely tried to make deliberate choices about my direction.\n\nI do not have complete clarity. I still do not know if CoralEHR will work. I still do not know where I will be in a year. But I think the shift is that uncertainty does not feel like failure anymore. It feels like being early. And there is a difference between not knowing and not trying.",
    creativeProblemSolving:
      "The biggest reframe of the semester, looking back, is about the relationship between certainty and action. I used to think I needed to figure out the right path before I could commit to it. The Life Design approach flipped that  - you commit to exploring, you prototype, you talk to people, and the clarity comes from the action, not before it.\n\nApplying that to my own situation: I do not need to know whether CoralEHR will be a billion-dollar company or whether I will end up as a design engineer somewhere. What I need is to keep designing experiments, keep having conversations, keep building, and trust that the direction will become clearer as I go. That is not passive. It is active uncertainty. And I think I am getting better at sitting with it.",
    biasToAction:
      "This week I did something that felt like a turning point. I wrote out a six-month plan  - not a rigid one, but a rough design for what I want the first six months after graduation to look like. Three months of full focus on CoralEHR, with specific milestones for the product and for fundraising. In parallel, a lean job search targeting design engineer roles at health tech companies, as a financial safety net that also builds relevant skills.\n\nI also finally finished the positioning document for CoralEHR that I have been working on all semester. It is clear, honest, and does not oversell. I am going to share it with three people this week and ask for brutal feedback.\n\nLooking back at the whole semester: I do not think these three months gave me a final answer. But they gave me something more useful  - a way of thinking about my life as something I am actively building, not something that is just happening to me. And the friends who have been with me through all of it  - the late nights, the football, the anxiety, the wins  - they are part of why any of this works. I am not building alone even when it feels like it. That feels like enough for now.",
    photoIds: [],
  },
];

/**
 * Insert seed entries into an empty database, then fetch and attach photos.
 * No-op if any entries already exist.
 * Returns the number of entries inserted.
 */
export async function seedIfEmpty(): Promise<number> {
  const existing = await listEntries();
  if (existing.length > 0) return 0;

  const entries: Entry[] = SEED_ENTRIES.map((raw) => {
    // Set createdAt/updatedAt to the entry's own date so "last edited"
    // matches the displayed date instead of showing today's date.
    const ts = new Date(raw.date + "T20:00:00").getTime();
    return {
      ...raw,
      id: uuid(),
      createdAt: ts,
      updatedAt: ts,
    };
  });

  await getDb().entries.bulkAdd(entries);

  // Attach photos from public/ in the background
  for (const [indexStr, filenames] of Object.entries(ENTRY_PHOTOS)) {
    const idx = Number(indexStr);
    const entry = entries[idx];
    if (!entry) continue;
    const photoIds: string[] = [];
    for (const name of filenames) {
      try {
        const res = await fetch(`/${name}`);
        if (!res.ok) continue;
        const blob = await res.blob();
        const photo = await addPhoto(blob, name);
        photoIds.push(photo.id);
      } catch {
        /* skip photos that fail to load */
      }
    }
    if (photoIds.length > 0) {
      // Use direct DB update to preserve the original updatedAt timestamp
      await getDb().entries.update(entry.id, {
        photoIds,
        updatedAt: entry.updatedAt,
      });
    }
  }

  return entries.length;
}
