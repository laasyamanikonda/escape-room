/* ============================================================================
   CONFIG - everything you'll want to edit lives in this file.
   You should never need to touch app.js or styles.css to change content.

   Text fields marked "html" accept basic HTML (<p>, <b>, <i>, <br>, <ul>...).

   TWO INTERNS, TWO LAPTOPS
   Each laptop is set to "Intern 1" or "Intern 2" at the start. Wherever you see
   an `intern: 1` or `intern: 2` tag below, that piece of the clue is only shown
   on that intern's screen. A piece with no tag shows on both screens. To move a
   piece to the other intern, just change its number.
   The two laptops do not talk to each other: each keeps its own progress,
   stopwatch and hints.
   ============================================================================ */

window.ESCAPE_CONFIG = {

  companyName: "Wayfair Insurance Company",

  /* Each hint adds this many seconds to the stopwatch (60 = 1 minute). */
  hintPenaltySeconds: 60,

  /* How long the "please relocate your teammates" countdown runs at the start. */
  gateCountdownSeconds: 15,

  /* Small label under each split clue so players realize there's another half.
     {n} becomes 1 or 2. Set to "" to hide it. */
  pageLabel: "Page {n} of 2",


  letters: { posters: "D", coffee: "A", stamps: "Y", bonus: "S" },

  order: ["posters", "coffee", "stamps", "bonus"],


  /* ==========================================================================
     INTRO  (first screen, before the desktop)
     ========================================================================== */
  intro: {
    windowTitle: "OVERTIME_NOTICE.txt - Notepad",
    html: `
      <p><b>TO:</b> All Interns<br>
         <b>FROM:</b> Wayfair Insurance Company<br>
         <b>RE:</b> Mandatory Overtime (again)</p>
      <p>Congratulations! Due to a scheduling oversight, you are all still in the
         building. Nobody clocks out until every task on these workstations has been
         completed. No exceptions. </p>
      <p>Your tasks are filed in the folders on the desktop: you may complete these tasks in
         ANY order. </p>
      <p>Document your results in <b>My_Notes.txt</b>. </p>
      <p> Only TWO interns may remain at the workstations. All other
         interns must report to the File Room immediately. Communication between the
         two rooms is a core company value.</p>`,
    continueButton: "I understand",

    /* Step 2: each laptop picks who it belongs to. */
    pickTitle: "WORKSTATION ASSIGNMENT",
    pickHtml: `
      <p>Each intern was issued different paperwork. Please select your name badge.</p>
      <p class="small"> <b>IMPORTANT!!!!!!!!:</b> Two workstations, two interns. DO NOT pick the same one, or you will be stuck and unable to proceed.</p>`,
    pickButton1: "I am Intern 1",
    pickButton2: "I am Intern 2",

    /* Step 3: countdown while everyone else leaves. */
    relocateTitle: "RELOCATION IN PROGRESS",
    relocateHtml: `
      <p>Please wait while your teammates report to the File Room.</p>
      <p>The workstations will unlock once the room has been cleared.</p>`,
    confirmButton: "I confirm only the two workstation interns are in this room",
    confirmWaiting: "Waiting for the room to clear...",
  },


  /* ==========================================================================
     PUZZLE 1 - POSTERS + STRING
     Physical: the file room walls are covered in motivational posters and
     employee-of-the-month photos. Stretchy string held at four corner posters
     forms an X. Where the string crosses is the word DREAMS.
       top left     = the PURPOSE poster
       bottom left  = the FLOWERS poster
       bottom right = the CAT poster
       top right    = the word "OFFICE" on the office poster
     ========================================================================== */
  posters: {
    windowTitle: "Wall_of_Inspiration - File Folder",
    folderName: "Wall_of_Inspiration",
    tab: "WALL OF INSPIRATION",

    /* The clue, split across the two interns. */
    parts: [
      { intern: 1, html: `
        <p><b>MEMO</b> &mdash; FACILITIES<br>
           <b>RE:</b> The Wall of Motivation</p>
           <p>Hope you're loving all of the inspiration you see around the room!!!! </p>
           <p>Not all of the posters are decoration. Four of the posters were hung with great
           care, and they are the only ones that matter.</i></p>
           <p>Top right: Your FAVORITE place on earth!!!</p>
        <p>Bottom right: I <b>SMELL</b> a mouse!</p>` },
           
      { intern: 2, html: `
        <p><b>MEMO</b> &mdash; FACILITIES<br>
           <b>RE:</b> The Wall of Motivation (cont.)</p>
        <p>Employees who look at one poster at a time tend to miss the big
           picture. <b>Look around the room for something to CONNECT the dots! X marks the spot!</b></p>
        <p>Top left: The ____ of your life is to work here!</p>
        <p>Bottom left: Get out a writing utensil for all that paperwork you'll be doing!</p>
        
      </div>` }
    ],

    answerLabel: "Enter your word from the wall:",
    submitText: "Submit to Facilities",
    wrongText: "Submission rejected. That is not where X marks the spot.",
    successText: "Facilities approves. The wall has never been more inspirational.",
    /* The word the computer person types (case and spaces are ignored). */
    answer: "DREAMS",
    /* Shown on completion. This is how players figure out the lock order. */
    orderClue: "Logged 7:00 AM - OPENING shift",

    /* Hint 1 is general; hints 2-5 give one corner each. Each costs one hint. */
    hints: [
      "The string is in the bottom tier of the cart. Use it to connect the corners provided to you.",
      "TOP LEFT corner: PURPOSE.",
      "BOTTOM LEFT corner: the poster with FLOWERS.",
      "BOTTOM RIGHT corner: the poster with the CAT.",
      "TOP RIGHT corner: the word \"OFFICE\" on the office poster.",
      "How did you use this many hints.......the word is DREAMS"
    ]
  },


  /* ==========================================================================
     PUZZLE 2 - COFFEE
     Computer room reads the receipt aloud; file room adds the add-ins to cups
     of syrup. Exactly ONE order says "add creamer" - that cup reveals a letter.
     The receipt is split: each intern sees half of the orders.
     ========================================================================== */
  coffee: {
    windowTitle: "Break_Room_Orders - File Folder",
    folderName: "Break_Room_Orders",
    tab: "BREAK ROOM ORDERS",

    receipt: {
      shop: "UNPAID EXPERIENCE CAFE",
      sub: "Next up, your favorite activity: making coffee. Everyone's drinks sure do <b>SMELL GREAT</b>!! Make sure you don't sneak a sip (although we have no way of knowing ",
      subIntern: 1,          // which intern sees the `sub` line (remove to show both)
      orderNo: "Order #4471",
      timeLine: "Make each cup like your (nonexistent) paycheck depends on it!! And, remember: you'll never get this all done in time if you don't work together.",
      timeLineIntern: 2,     // which intern sees the `timeLine` line (remove to show both)
      footer: ["Tip: $0.00 (interns work for 'experience')", "Thank you! Come back never."],

      /* Exactly ONE of these says "add creamer". */
      orders: [
        { intern: 1, name: "Ollie",    drink: "Vanilla Latte",    addIn: "add sugar" },
        { intern: 2, name: "Mei",      drink: "Black Coffee",     addIn: "add stevia" },
        { intern: 1, name: "Laasya",   drink: "Cinammon Latte",   addIn: "add creamer" },
        { intern: 2, name: "Louis",    drink: "Raspberry Latte",  addIn: "add 2 sugars" },
        { intern: 1, name: "Brighton", drink: "Black Coffee",     addIn: "add 2 stevia" },
        { intern: 2, name: "Dom",      drink: "Peppermint Mocha", addIn: "No extra additions" }
        
      ]
    },

    answerLabel: "Enter the letter from the order:",
    submitText: "Submit Order",
    wrongText: "Order rejected. The barista is confused.",
    successText: "Order confirmed. Caffeine levels restored.",
    orderClue: "Logged 9:30 AM - Morning break",

    hints: [
      "Smell each cup, and match the customization to each cup accordingly.",
      "Nearly every order has a similar customization. Look for the one that doesn't.",
    ],

    /* The separate "I used the creamer on the wrong cup" button. Costs one hint. */
  },


  /* ==========================================================================
     PUZZLE 3 - STAMPS
     Physical: each player stamps a different letter on a finger. Linked together,
     the fingers spell a password. The password unlocks a file here.
     The pamphlet is split: each intern sees half of it.
     ========================================================================== */
  stamps: {
    windowTitle: "Onboarding_Ritual - File Folder",
    folderName: "Onboarding_Ritual",
    tab: "WELCOME TO THE FAMILY",

    /* ---------------------------------------------------------------------
       HOW TO REPLACE THE PAMPHLET WITH A VIDEO
       1. Make a folder called "assets" next to index.html and put your video
          in it (MP4 / H.264 plays everywhere), e.g.  assets/ritual.mp4
       2. Set videoSrc below to that path:   videoSrc: "assets/ritual.mp4",
       3. (Optional) set videoPoster to a still image path for the thumbnail.
       When videoSrc is not empty the pamphlet is hidden and BOTH interns see
       the same video instead. Set it back to "" to bring the pamphlet back.
       ------------------------------------------------------------------- */
    videoSrc: "",
    videoPoster: "",

    pamphletParts: [
      { intern: 1, html: `
        <h2>Welcome to the Wayfair Insurance Company!</h2>
        <p>At Wayfair, we believe in <i>tradition</i>.</p>
        <p>Our company has a ritual: every employee is imprinted with our core values!
           You'll find the supplies you need in red & blue.` },
      { intern: 2, html: `
        <p>When deciphering the code, remember that <b>team bonding</b> is essential. Everyone's <b>HANDS</b> share the work here at Wayfair, and we must stay <b>INTERLINKED</b> to be successful.  </p>
        <p class="small">By way of this ritual, we want to LEAVE A MARK on you!</p>` }
    ],

    lockedFileName: "ritual_results.txt",
    passwordLabel: "This file is password protected. Pa ssword:",
    submitText: "Unlock",
    /* The password the linked fingers spell (case and spaces are ignored). */
    password: "TEAMWORK",
    wrongText: "Incorrect password. Access denied.",

    unlockedText: "Congrats! You've unlocked this letter:",
    orderClue: "Logged 4:55 PM - End-of-day ritual",

    hints: [
      "Team bonding is essential. Hands are involved, and more than one pair.",
      "Each person has a letter on their finger. Put the hands together and read across."
    ]
  },


  /* ==========================================================================
     BONUS LETTER  (HR_Message.txt, always on the desktop)
     ========================================================================== */
  bonus: {
    windowTitle: "HR_Message.txt - Notepad",
    iconLabel: "HR_Message.txt",
    html: `
      <p><b>FROM:</b> Human Resources<br>
         <b>SENT:</b> 11:48 PM (after hours)<br>
         <b>RE:</b> Almost done!</p>
      <p>Great job on the teamwork! We&rsquo;re so proud of all of you. </p>
      <p>As a reward, here is a free bonus question for the road:</p>
      <p><b>What letter comes when talking about plurals (like GROUPS of amazing INTERNS!)?? </b></p>`
  },


  /* ==========================================================================
     CLOCK OUT  (the final screen, always on the desktop)
     ========================================================================== */
  final: {
    windowTitle: "CLOCK_OUT.exe",
    iconLabel: "Clock_Out.exe",
    introHtml: `
      <p>Enter the 4-letter badge code to officially clock out.</p>
      <p class="small">Letters must be entered in the order your tasks were logged.</p>`,
    submitText: "Clock Out",
    wrongText: "Invalid code. HR has been notified.",
    successHtml: `
      <p><b>ACCESS GRANTED.</b></p>
      <p>YOU HAVE BEEN CLOCKED OUT!!!!!!!! Enjoy your freedom. For now...</p>`,

    hints: [
      "Each completed folder has a task log line with a time. The order matters.",
      "Put the logged times in order, earliest first. Letters follow the same order.",
      "HR's bonus question is about grammar: what do you add to make most words plural?"
    ]
  },  


  /* ==========================================================================
     MISC TEXT
     ========================================================================== */
  notes: {
    windowTitle: "My_Notes.txt - Notepad",
    intro: "Write down every answer you find. You'll want these at the end.",
    labels: {
      posters: "Wall of Inspiration",
      coffee: "Break Room Orders",
      stamps: "Onboarding Ritual",
      bonus: "HR Bonus"
    },
    freePlaceholder: "Scratch space for anything else..."
  },

  readme: {
    windowTitle: "READ_ME_FIRST.txt - Notepad"
  },

  trash: {
    windowTitle: "Recycle Bin",
    text: "The Recycle Bin is empty. (Unlike your inbox.)"
  },

  shutdown: {
    title: "Shut Down Windows",
    text: "It is not time to go home yet. Please finish your tasks."
  }
};
