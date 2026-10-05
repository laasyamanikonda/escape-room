# Overtime Workstation - Escape Room Computer

A retro Windows 95-style desktop for an office-themed escape room. One player stays at the
computer while teammates work the physical puzzles in the "file room" and relay information.

No build step, no dependencies, no internet needed. Just open `index.html`.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page skeleton |
| `styles.css` | The Windows 95 look |
| `config.js` | **Everything you'll edit:** letters, passwords, clue text, hints, timestamps |
| `app.js` | Game logic (you shouldn't need to touch this) |

## Game flow

1. **Intro:** the team reads the overtime notice, then a 30-second countdown runs while everyone
   except one person leaves for the file room. The remaining player confirms they are alone, and
   the stopwatch starts.
2. **Desktop:** three folders (any order): **Q3_Transparency** (plexiglass), **Break_Room_Orders**
   (coffee receipt), **Onboarding_Ritual** (stamps). Plus `My_Notes.txt` for tracking letters.
3. **Hints:** every puzzle has a Hint button. Each hint adds 1:00 to the stopwatch (and the coffee
   puzzle has a separate "Wrong cup? Request backup creamer" button, which also costs a hint).
4. **Ending:** when all three tasks are done, `HR_Message.txt` (the cheeky 4th letter) and
   `Clock_Out.exe` appear. Players enter the 4-letter code, the stopwatch stops, and they're told to
   open the lockbox for the badge.

## Customizing (all in `config.js`)

- **Letters / final word:** `letters` and `order`. The placeholder word is **D-A-Y-S**.
- **Stamp password:** `stamps.password` (placeholder `TEAMWORK`).
- **Lock-order clues:** each task's `orderClue` timestamp. Players put the letters in the order of
  the logged times; the bonus letter's message is timestamped last.
- **Coffee receipt:** `coffee.receipt.orders` (keep exactly one `add creamer`).
- **Backup creamer location:** `coffee.specialHint.text`.
- **Hint cost / countdown length:** `hintPenaltySeconds`, `gateCountdownSeconds`.

### Swapping the stamp pamphlet for a video

1. Put your video in an `assets/` folder next to `index.html` (MP4 / H.264 is safest).
2. In `config.js`, set `stamps.videoSrc: "assets/ritual.mp4"` (and optionally `videoPoster`).
3. Set it back to `""` to bring the pamphlet back.

## Running a session

- Progress is saved in the browser (`localStorage`), so a refresh won't lose anything.
- **Reset between teams:** open `index.html?reset`, or press **Ctrl + Alt + R** on the desktop.
- Test the full flow yourself first: the countdown is 30 seconds, and your own progress will need a
  reset before the real team plays.

## Putting it on GitHub / GitHub Pages

```bash
cd escape-room
git init
git add .
git commit -m "Escape room workstation"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then in the repo: **Settings -> Pages -> Build and deployment -> Deploy from a branch -> `main` / root**.
Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

Heads-up for your portfolio: the answers are in `config.js`, which is public on GitHub. Anyone can read
them, so it's best to change the letters/passwords before running a real game, or keep the live game
build in a private repo and show the public one as a demo.
