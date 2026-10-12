# Overtime Workstation - Escape Room Computers

A retro Windows 95-style desktop for an office-themed escape room. **Two interns, two laptops** stay in
the computer room; two more interns work the physical puzzles in the "file room" and relay information.
Each laptop shows a different half of every clue, so the two computer interns have to combine them.

No build step, no dependencies, no internet needed. Just open `index.html` on each laptop.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Page skeleton |
| `styles.css` | The Windows 95 look |
| `config.js` | **Everything you'll edit:** letters, answers, clue text, hints, which intern sees what |
| `app.js` | Game logic (you shouldn't need to touch this) |

## Game flow

1. **Intro (each laptop):** read the overtime notice, click **I am Intern 1** or **I am Intern 2**, then a
   15-second countdown runs while everyone else leaves for the file room. Confirming starts that laptop's
   stopwatch.
2. **Desktop:** three folders (any order): **Wall_of_Inspiration** (posters + string), **Break_Room_Orders**
   (coffee receipt), **Onboarding_Ritual** (stamps). Plus `My_Notes.txt` for tracking letters,
   `HR_Message.txt` (the cheeky 4th letter) and `Clock_Out.exe` (the 4-letter lock code).
3. **Hints:** every puzzle has a Hint button. Each hint adds 1:00 to that laptop's stopwatch (the coffee
   puzzle also has a separate "need more supplies?" button that costs a minute and reveals the backup
   creamer location). The posters puzzle has 5 hints: a general one, then one per corner.
4. **Ending:** entering the correct 4-letter code in `Clock_Out.exe` stops the stopwatch.

## The posters puzzle (physical setup)

Walls covered in motivational posters and employee-of-the-month photos. Stretchy string held at four
corner posters makes an X; the X crosses over the word **DREAMS**.

| Corner | What's there |
| --- | --- |
| Top left | the PURPOSE poster |
| Bottom left | the FLOWERS poster |
| Bottom right | the CAT poster |
| Top right | the word "OFFICE" on the office poster |

The computer person types `DREAMS` into the folder and gets the letter.

## How the two-intern split works

The laptops are **independent** (a static site can't talk between two computers). Each keeps its own
progress, hints and stopwatch, and nothing is locked behind the other laptop, so `HR_Message.txt` and
`Clock_Out.exe` are always on the desktop. Either laptop can enter any answer. Use the stopwatch of the
laptop that clocks out as the team time.

In `config.js`, clue pieces are tagged `intern: 1` or `intern: 2` and only show on that laptop. Untagged
pieces show on both. To move a piece, change its number:

- posters memo: `posters.parts`
- coffee receipt orders: `coffee.receipt.orders` (plus `subIntern` / `timeLineIntern` for the two text lines)
- stamps pamphlet: `stamps.pamphletParts`

A small "Page 1 of 2" / "Page 2 of 2" label is shown under each split clue. Set `pageLabel: ""` to hide it.

## Customizing (all in `config.js`)

- **Letters / final word:** `letters` and `order`. Placeholder word is **D-A-Y-S**.
- **Poster answer:** `posters.answer` (`DREAMS`). **Stamp password:** `stamps.password` (`TEAMWORK`).
- **Lock-order clues:** each task's `orderClue` timestamp. Players put the letters in the order of the
  logged times; the HR bonus letter's message is timestamped last.
- **Backup creamer location:** `coffee.specialHint.text`.
- **Hint cost / countdown length:** `hintPenaltySeconds`, `gateCountdownSeconds`.

### Swapping the stamp pamphlet for a video

1. Put your video in an `assets/` folder next to `index.html` (MP4 / H.264 is safest).
2. In `config.js`, set `stamps.videoSrc: "assets/ritual.mp4"` (and optionally `videoPoster`).
3. Set it back to `""` to bring the pamphlet back. Both interns see the same video.

## Running a session (game master)

- Progress is saved in each laptop's browser, so a refresh won't lose anything.
- **Reset between teams (do this on BOTH laptops):** open `index.html?reset`, or press **Ctrl + Alt + R**.
- **Fix a wrong Intern pick without losing progress:** press **Ctrl + Alt + I** to swap that laptop
  between Intern 1 and Intern 2.
- Test the whole flow yourself first, then reset both laptops before the real team plays.

## Putting it on GitHub / GitHub Pages

```bash
git add .
git commit -m "Posters puzzle + two-intern split"
git push
```

Pages updates a minute or two after each push. (First time? In the repo: **Settings -> Pages -> Deploy
from a branch -> `main` / root**.)

Heads-up for your portfolio: the answers are in `config.js`, which is public on GitHub. Change the
letters/passwords before running a real game, or keep the live game build in a private repo and show the
public one as a demo.
