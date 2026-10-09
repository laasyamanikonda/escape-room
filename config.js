/* ============================================================================
   CONFIG - everything you'll want to edit lives in this file.
   You should never need to touch app.js or styles.css to change content.

   Text fields marked "html" accept basic HTML (<p>, <b>, <i>, <br>, <ul>...).
   ============================================================================ */

window.ESCAPE_CONFIG = {

  companyName: "Wayfair Insurance Company",

  /* Each hint adds this many seconds to the stopwatch (60 = 1 minute). */
  hintPenaltySeconds: 60,

  /* How long the "please relocate your teammates" countdown runs at the start. */
  gateCountdownSeconds: 15,

  /* --------------------------------------------------------------------------
     THE LETTERS  (placeholder word: D-A-Y-S)
     These four letters are the answer to the 4-letter bike lock, in the order
     listed in `order` below. Change them to whatever your final word is.
       plexiglass -> revealed by the stacked plexiglass sheets
       coffee     -> revealed in the creamer cup
       stamps     -> given on screen after the stamp password is entered
       bonus      -> the "cheeky" HR letter (never shown on screen, they deduce it)
     -------------------------------------------------------------------------- */
  letters: { plexiglass: "D", coffee: "A", stamps: "Y", bonus: "S" },

  /* The order the letters go into the lock. Players work this out from the
     timestamps in each task's "orderClue" (see below). Reorder as you like,
     and edit the orderClue lines so they still point to the right order. */
  order: ["plexiglass", "coffee", "stamps", "bonus"],


  /* ==========================================================================
     INTRO  (first screen, before the desktop)
     ========================================================================== */
  intro: {
    windowTitle: "OVERTIME_NOTICE.txt - Notepad",
    html: `
      <p><b>TO:</b> All Interns<br>
         <b>FROM:</b> Human Resources<br>
         <b>RE:</b> Mandatory Overtime (again)</p>
      <p>Congratulations! Due to a scheduling "oversight," you are all still in the
         building. Nobody clocks out until every task on this workstation has been
         completed. No exceptions. Not even for interns who "have a life."</p>
      <p>Your tasks are filed in the folders on the desktop. Complete them in
         whatever order you like. Frankly, we don't care.</p>
      <p>Document your results in <b>My_Notes.txt</b>. Management does not tolerate
         lost paperwork, and you will need everything you find at the very end.</p>
      <p><b>Policy 4.2:</b> Only ONE intern may remain at this workstation. All other
         interns must report to the File Room immediately. Communication between the
         two rooms is a core company value.</p>`,
    continueButton: "I understand",

    relocateTitle: "RELOCATION IN PROGRESS",
    relocateHtml: `
      <p>Please wait while your teammates report to the File Room.</p>
      <p>The workstation will unlock once the room has been cleared.</p>`,
    confirmButton: "I confirm I am the only intern at this workstation",
    confirmWaiting: "Waiting for the room to clear...",
  },


  /* ==========================================================================
     PUZZLE 1 - PLEXIGLASS
     Physical: three plexiglass sheets hidden in a random file folder. Stacked and
     held up at the right angle, they show a letter.
     ========================================================================== */
  plexiglass: {
    windowTitle: "Q3_Transparency - File Folder",
    folderName: "Q3_Transparency",
    tab: "Q3 TRANSPARENCY REPORT",

    /* Clue text. Redaction bars are just <span class="redact" style="width:..px">. */
    html: `
      <div class="paper">
        <p><b>MEMO</b> &mdash; CONFIDENTIAL<br>
           <b>RE:</b> Q3 Transparency Report (DRAFT)</p>
        <p>Per Legal, the Q3 report has been split into three
           &ldquo;transparent&rdquo; sections and filed in three separate places
           (do <u>not</u> ask which). We LOVE honesty & transparency here at Wayfair (except if one of your bosses is bad at their jobs. Keep that to yourself.) On their own, each section tells you nothing.</p>
        <p>Section 1 of 3: <span class="redact" style="width:150px"></span>
           <span class="redact" style="width:60px"></span></p>
        <p>Section 2 of 3: <span class="redact" style="width:90px"></span>
           <span class="redact" style="width:120px"></span></p>
        <p>Section 3 of 3: <span class="redact" style="width:130px"></span>
           <span class="redact" style="width:80px"></span></p>
        <p>Management would like the final figures to be &ldquo;in alignment&rdquo;
           before anyone clocks out. Reminder: it&rsquo;s easy to lose sight of the big
           picture when you&rsquo;re stuck in the weeds. Try to put it all into
           perspective.</p>
        <p class="small">Printed on 100% recycled, see-through paper.</p>
      </div>`,

    answerLabel: "Enter the letter from the audit:",
    submitText: "File Audit",
    wrongText: "Audit rejected. That doesn't match our records.",
    successText: "Audit accepted. Legal is thrilled.",
    /* Shown on completion. This is how players figure out the lock order. */
    orderClue: "Logged 7:00 AM - Opening shift",

    hints: [
      "The sections are useless alone. They only mean something together.",
      "Those transparent sheets: what happens if you stack them?",
      "Hold the stack up in front of you and adjust your distance and angle until it all lines up."
    ]
  },


  /* ==========================================================================
     PUZZLE 2 - COFFEE
     Computer room reads the receipt aloud; file room adds the add-ins to cups
     of syrup. Exactly ONE order says "add creamer" - that cup reveals a letter.
     ========================================================================== */
  coffee: {
    windowTitle: "Break_Room_Orders - File Folder",
    folderName: "Break_Room_Orders",
    tab: "BREAK ROOM ORDERS",

    receipt: {
      shop: "UNPAID EXPERIENCE CAFE",
      sub: "Next up, your favorite activity: making coffee. Everyone's drinks sure do SMELL GREAT!! Too bad you won't be able to drink yours until it's gross & watered down.",
      orderNo: "Order #4471",
      timeLine: "Make each cup o' joe like your (nonexistent) paycheck depends on it!! And, remember: you'll never get this all done in time if you don't work together.",
      footer: ["Tip: $0.00 (interns work for 'experience')", "Thank you! Come back never."],
       
      /* Exactly ONE of these say "add creamer". */
       
      orders: [
        { name: "Ollie",   drink: "Gingerbread Latte",  addIn: "add sugar" },
        { name: "Mei", drink: "Lavender Honey Latte", addIn: "add stevia" },
        { name: "Laasya",  drink: "Pumpkin Spice Latte",    addIn: "add creamer" },
        { name: "Louis",   drink: "Vanilla Bean Latte",   addIn: "add 2 sugars" },
        { name: "Brighton",    drink: "Hazelnut Latte",       addIn: "add honey" },
        { name: "Josh",   drink: "Caramel Macchiato",    addIn: "add stevia" },
        { name: "Dom",    drink: "Peppermint Mocha",     addIn: "add agave" },
        { name: "Rosa",   drink: "Maple Pecan Latte",    addIn: "add sugar" },
        { name: "Cal",    drink: "Cinnamon Dolce Latte", addIn: "add brown sugar" },
        { name: "Bea",    drink: "Toasted Coconut Latte", addIn: "add stevia" }
      ]
    },

    answerLabel: "Enter the letter from the order:",
    submitText: "Submit Order",
    wrongText: "Order rejected. The barista is confused.",
    successText: "Order confirmed. Caffeine levels restored.",
    orderClue: "Logged 9:30 AM - Morning break",

    hints: [
      "Nearly every order has a similar customization. Look for the one that doesn't.",
      "Don't smell every cup alone. Divide the cups, then check them against the receipt."
    ],

    /* The separate "I used the creamer on the wrong cup" button. Costs one hint.
       Replace the text with wherever you actually hide the spare creamer. */
    specialHint: {
      label: "Added something to the wrong cup? Need more supplies?",
      confirm: "Requesting backup stevia, sugar, or creamer counts as a hint and adds time to your clock.",
      text: "BACKUP CREAMER: [REPLACE ME - [NEED TO CHANGE THIS TO ADD WHERE THE BACKUP CREAMER IS]."
    }
  },


  /* ==========================================================================
     PUZZLE 3 - STAMPS
     Physical: each player stamps a different letter on a finger. Linked together,
     the fingers spell a password. The password unlocks a file here.
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
       When videoSrc is not empty the pamphlet is hidden and the video is shown
       instead. Set it back to "" to bring the pamphlet back.
       ------------------------------------------------------------------- */
    videoSrc: "",
    videoPoster: "",

    pamphletHtml: `
      <div class="paper pamphlet">
        <h2>Welcome to the Wayfair Insurance Company!</h2>
        <p>At Wayfair, we believe in <i>tradition</i>.</p>
        <p>Our company has a ritual: every employee receives a special stamped tattoo.
           You&rsquo;ll find your stamp, and the pad on top of it.</p>
        <p>When deciphering the code, remember that <b>team bonding</b> is essential.</p>
        <p class="small">By way of this ritual, we want to LEAVE A MARK on you! 
           </p>
      </div>`,

    lockedFileName: "ritual_results.txt",
    passwordLabel: "This file is password protected. Password:",
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
     BONUS LETTER  (appears on the desktop once all three tasks are done)
     ========================================================================== */
  bonus: {
    windowTitle: "HR_Message.txt - Notepad",
    iconLabel: "HR_Message.txt",
    toast: "New message from Human Resources",
    html: `
      <p><b>FROM:</b> Human Resources<br>
         <b>SENT:</b> 11:48 PM (after hours)<br>
         <b>RE:</b> Good job!</p>
      <p>Great job on the teamwork! We&rsquo;re so proud of all of you. (Mostly the one
         who stayed behind and did all the typing.)</p>
      <p>As a reward, here is a free bonus question for the road:</p>
      <p><b>What letter comes when talking about plurals?</b></p>
      <p class="small">Don&rsquo;t overthink it. We certainly didn&rsquo;t.</p>`
  },


  /* ==========================================================================
     CLOCK OUT  (the final screen; appears once all three tasks are done)
     ========================================================================== */
  final: {
    windowTitle: "CLOCK_OUT.exe",
    iconLabel: "Clock_Out.exe",
    introHtml: `
      <p>Enter the 4-letter badge code to unlock the lockbox and receive your
         employee badge.</p>
      <p class="small">Letters must be entered in the order your tasks were logged.</p>`,
    submitText: "Clock Out",
    wrongText: "Invalid code. HR has been notified.",
    successHtml: `
      <p><b>ACCESS GRANTED.</b></p>
      <p>Your employee badge is waiting in the lockbox. Scan it at the door to clock
         out. Enjoy your freedom.</p>`,

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
      plexiglass: "Q3 Transparency",
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
