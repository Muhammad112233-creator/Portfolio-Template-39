<p align="center">
  <img src="docs/readme/banner.svg" alt="Skybound Portfolio: a sky you can turn like a page, and a robot to show you around." width="100%">
</p>

<p align="center">
  <b>A scroll-driven 3D portfolio template.</b><br>
  Eight pages, one small robot, and not a single stock template in sight.
</p>

<p align="center">
  <img src="docs/readme/stack.svg" alt="Next.js 16, React 19, Three.js, React Three Fiber, GSAP, Lenis, Tailwind 4, TypeScript">
</p>

<p align="center">
  <a href="#quick-start">Quick start</a> ·
  <a href="#make-it-yours">Make it yours</a> ·
  <a href="#put-it-online">Put it online</a> ·
  <a href="#credits-and-licence">Credits</a>
</p>

<img src="docs/readme/scroll.svg" alt="" width="100%">

<br>

<a id="tour"></a>
<img src="docs/readme/h-tour.svg" alt="Take the tour" width="100%">

<p align="center">
  <img src="docs/readme/tour.webp" alt="A flip-book of the home page: the robot hops off his island, pushes a desk across the sky, the sky turns like a page, a laptop opens onto a night sky." width="88%">
</p>

The home page is one long story told by scrolling:

1. **A sky with a clock.** Day turns to sunset and to a night with an aurora, on its own or when you press the dial.
2. **Bolt hops off his island**, pushes a desk across the screen and spells your name as he passes each letter.
3. **The sky turns like a page** and the first real section is underneath.
4. **He jumps from section to section**: sits at the desk, stands between two words of a title, then spins a ring of your projects.
5. **A laptop opens on a patch of lawn** and the camera flies into the screen, which is a window onto the next section.
6. **A night walk** past your clients, one small accident, and the list of what you offer.

<table>
  <tr>
    <td width="33%"><img src="docs/readme/shot-home.jpg" alt="Home, the hero"><br><sub><b>Home</b> · the hero</sub></td>
    <td width="33%"><img src="docs/readme/shot-why.jpg" alt="Home, after the page turn"><br><sub><b>Home</b> · after the page turn</sub></td>
    <td width="33%"><img src="docs/readme/shot-work-orbit.jpg" alt="Home, the ring of projects"><br><sub><b>Home</b> · the ring of projects</sub></td>
  </tr>
  <tr>
    <td><img src="docs/readme/shot-laptop.jpg" alt="Home, the laptop"><br><sub><b>Home</b> · lift the lid</sub></td>
    <td><img src="docs/readme/shot-night.jpg" alt="Home, the night walk"><br><sub><b>Home</b> · the night walk</sub></td>
    <td><img src="docs/readme/shot-craft.jpg" alt="Home, the craft scene"><br><sub><b>Home</b> · half sketch, half code</sub></td>
  </tr>
  <tr>
    <td><img src="docs/readme/shot-work.jpg" alt="Work index"><br><sub><b>/work</b> · a reel you can scroll, drag or mix</sub></td>
    <td><img src="docs/readme/shot-project.jpg" alt="A case study"><br><sub><b>/work/[slug]</b> · case study</sub></td>
    <td><img src="docs/readme/shot-services.jpg" alt="Services"><br><sub><b>/services</b> · four services, 24 moving cards</sub></td>
  </tr>
  <tr>
    <td><img src="docs/readme/shot-about.jpg" alt="About"><br><sub><b>/about</b> · a desk you can tidy</sub></td>
    <td><img src="docs/readme/shot-play.jpg" alt="Playground"><br><sub><b>/playground</b> · pick a track, he dances</sub></td>
    <td><img src="docs/readme/shot-contact.jpg" alt="Contact"><br><sub><b>/contact</b> · a form that works without a server</sub></td>
  </tr>
</table>

Also in the box: `/photography`, `/faq` and a 404 page.

<img src="docs/readme/divider.svg" alt="" width="100%">

<a id="what-is-inside"></a>
<img src="docs/readme/h-inside.svg" alt="What is inside" width="100%">

|                               |                                                                                                                                                                                                     |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Real 3D, written by hand**  | The sky, clouds, stars and aurora are one GLSL shader. The islands are generated from noise. The laptop, desk and rocks are built from primitives. The only model file is the robot (under 0.5 MB). |
| **One robot, fourteen moves** | Sit, wave, walk, jump, dance, trip over. Every scene blends the clips that ship with the model, driven by scroll.                                                                                   |
| **Page transitions**          | Four columns drop, the route swaps underneath, they fall away. Works with the browser's back button.                                                                                                |
| **Sound, optional**           | A soft click and a whoosh, with a toggle that is remembered. The playground music is synthesised in the browser, so there is no audio to license.                                                   |
| **Custom cursor**             | A blend-mode dot that grows over links and carries a label over pictures. Touch devices never see it.                                                                                               |
| **Fast by default**           | Static export. Each 3D canvas mounts only near the viewport and stops drawing when it leaves. No GPU? The hero becomes a still picture.                                                             |
| **Yours to edit**             | All words and data live in `src/content`. You can change the whole site without opening a component.                                                                                                |
| **Hosts anywhere**            | The build is a folder of plain files. GitHub Pages workflow included.                                                                                                                               |

<img src="docs/readme/divider.svg" alt="" width="100%">

<a id="quick-start"></a>
<img src="docs/readme/h-start.svg" alt="Quick start" width="100%">

You need [Node.js](https://nodejs.org) 20.9 or newer.

```bash
git clone https://github.com/Muhammad112233-creator/Portfolio-Template-39.git
cd skybound-portfolio
npm install
npm run dev
```

Open <http://localhost:3000>.

| Command             | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Starts the site locally and reloads as you edit |
| `npm run build`     | Builds the finished site into `out/`            |
| `npm run start`     | Serves `out/` so you can check the real build   |
| `npm run typecheck` | Checks the TypeScript without building          |

> [!TIP]
> Add `?lite` to the address to see the version shown on machines with no GPU, and `?full3d` to force the 3D on one.

<img src="docs/readme/divider.svg" alt="" width="100%">

<a id="make-it-yours"></a>
<img src="docs/readme/h-yours.svg" alt="Make it yours" width="100%">

Everything personal is in **`src/content`**. Start with `site.ts`: change the name there and the nav, the loader, the hero letters, the footer and the page titles all follow.

| To change                                                                     | Edit                                                                                             |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Name, role, email, city, time zone, social links, every line on the home page | `src/content/site.ts`                                                                            |
| Projects (one object each: text, tags, pictures)                              | `src/content/projects.ts` and `public/projects/<slug>/`                                          |
| Services, their cards and promises                                            | `src/content/services.ts`                                                                        |
| Reviews                                                                       | `src/content/reviews.ts`                                                                         |
| Client names and which row they sit in                                        | `src/content/clients.ts`                                                                         |
| Client wordmarks                                                              | `src/components/site/ClientLogo.tsx`                                                             |
| Questions and answers                                                         | `src/content/faq.ts`                                                                             |
| About, contact, playground and other inner-page text                          | `src/content/pages.ts`                                                                           |
| Photographs and captions                                                      | `src/content/photos.ts` and `public/photos/`                                                     |
| Colours, type sizes, spacing                                                  | the `:root` block at the top of `src/app/globals.css`                                            |
| Fonts                                                                         | `src/fonts/` and `src/app/layout.tsx`                                                            |
| The logo mark                                                                 | `src/components/site/Monogram.tsx` and `src/app/icon.svg`                                        |
| Films in "How a project runs"                                                 | `public/films/` (four short MP4s with posters)                                                   |
| Social card                                                                   | `public/og.jpg` (1200 × 630)                                                                     |
| The "Free template" tab on the right edge                                     | `repo` in `src/content/site.ts`, or remove `<Ribbon />` from `src/components/site/Providers.tsx` |

**A project needs seven pictures** in `public/projects/<slug>/`: `cover.webp` (16:10, used on the home page and the work reel) and `01.webp` to `06.webp` for its own page. `01`, `02`, `05` and `06` are shown full width, `03` and `04` side by side.

**The contact form** opens the visitor's mail app by default, so it works with no backend. To receive messages directly, copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_FORM_ENDPOINT` to a form endpoint (Formspree, Getform, Basin or your own API).

> [!IMPORTANT]
> The people, clients, projects and reviews in this template are **invented placeholders**. Replace them with real ones before you publish. Do not ship made-up testimonials.

<img src="docs/readme/divider.svg" alt="" width="100%">

<a id="swap-the-robot"></a>
<img src="docs/readme/h-robot.svg" alt="Swap the robot" width="100%">

Bolt is `public/models/robot.glb`. To use your own character:

1. Export a rigged model as `.glb` with animation clips. Free rigs and clips: [Mixamo](https://www.mixamo.com), [Ready Player Me](https://readyplayer.me), [Quaternius](https://quaternius.com).
2. Replace the file, keeping the name.
3. Open `src/components/three/Robot.tsx` and set `ROBOT_HEIGHT` to your model's height. If your clips have other names, change the `ClipName` list there, then the names used in `HeroScene.tsx`, `Actor.tsx`, `Clients.tsx` and `Mascot.tsx`.

The site uses these clips: `Idle`, `Sitting`, `Walking`, `Jump`, `Wave`, `Dance`, `Death` (the trip), plus `ThumbsUp`, `Punch`, `Yes` and `WalkJump` in the playground.

How big he is in each section is plain CSS. He is drawn to fit an invisible box: `.scene` in `Why.module.css`, `.stop` in `ServicesIntro.module.css`, `.mark` in `WorkOrbit.module.css`. Resize the box and he follows.

<img src="docs/readme/divider.svg" alt="" width="100%">

<a id="folder-map"></a>
<img src="docs/readme/h-map.svg" alt="Folder map" width="100%">

```text
skybound-portfolio
├─ public/                 files served as they are
│  ├─ models/robot.glb     the character
│  ├─ projects/<slug>/     cover + six pictures per project
│  ├─ photos/  films/  images/  audio/
│  └─ og.jpg               social card
├─ src/
│  ├─ app/                 one folder per page (Next.js App Router)
│  │  ├─ layout.tsx        fonts, metadata, the shell around every page
│  │  ├─ globals.css       design tokens and shared classes
│  │  └─ work/[slug]/      one case-study page per project
│  ├─ content/             ← all your words and data
│  ├─ components/
│  │  ├─ home/             the home page, one file per section
│  │  ├─ pages/            the inner pages
│  │  ├─ site/             nav, footer, cursor, transitions, text effects
│  │  └─ three/            Robot, Sky shader, shared 3D props, lazy canvas
│  ├─ lib/                 scroll, sound, synth, sky clock, small maths
│  └─ fonts/               Space Grotesk and Space Mono
├─ docs/readme/            the pictures in this README
└─ .github/workflows/      GitHub Pages deploy
```

Where the big moments live:

| Moment                                            | File                                                |
| ------------------------------------------------- | --------------------------------------------------- |
| Hero story (what happens at each scroll position) | `src/components/home/heroStory.ts`, `HeroScene.tsx` |
| The page turn                                     | `src/components/home/PageTurn.tsx`                  |
| The robot between sections                        | `src/components/home/Actor.tsx`                     |
| Laptop fly-through                                | `src/components/home/LaptopShowcase.tsx`            |
| Night walk and the fall                           | `src/components/home/Clients.tsx`                   |
| Sky shader                                        | `src/components/three/Sky.tsx`                      |
| Day / sunset / night clock                        | `src/lib/sky.ts`                                    |

<img src="docs/readme/divider.svg" alt="" width="100%">

<a id="built-with-care"></a>
<img src="docs/readme/h-notes.svg" alt="Built with care" width="100%">

- **Only what is on screen runs.** Each canvas is created as its section approaches and stops drawing when it leaves.
- **No GPU, no problem.** Software renderers get a still hero instead of a slideshow. Low-memory and data-saver devices render at a lower pixel ratio.
- **Phones get their own layout,** not a squeezed desktop: a shorter hero, stacked sections, tabs instead of columns.
- **Reduced motion is respected.** Smooth scrolling and text reveals switch off, and most looping animations stop, when the system asks for less motion.
- **Keyboard and screen readers.** There is a skip link, the menu closes with Escape and hands focus back to its button, the work reel has a plain list of links beside it, and decorative 3D is hidden from assistive tech.
- **Search engines.** Per-page titles and descriptions, a sitemap, `robots.txt`, a social card and FAQ structured data are generated at build time.

<img src="docs/readme/divider.svg" alt="" width="100%">

<a id="credits-and-licence"></a>
<img src="docs/readme/h-credits.svg" alt="Credits and licence" width="100%">

- **Code:** MIT, see [LICENSE](LICENSE). Use it for your own site or a client's, with or without credit.
- **Robot:** "RobotExpressive" by Tomás Laulhé, with modifications by Don McCurdy. CC0 1.0, from the three.js examples.
- **Fonts:** Space Grotesk by Florian Karsten and Space Mono by Colophon Foundry, both under the SIL Open Font License 1.1 (texts in `src/fonts/`).
- **Pictures and films:** generated for this template. Replace them with your own work.
- **Sounds:** synthesised for this template.
- **Built with:** [Next.js](https://nextjs.org), [React Three Fiber](https://r3f.docs.pmnd.rs), [drei](https://drei.docs.pmnd.rs), [three.js](https://threejs.org), [GSAP](https://gsap.com), [Lenis](https://lenis.darkroom.engineering) and [Tailwind CSS](https://tailwindcss.com).

Full details in [CREDITS.md](CREDITS.md).

<p align="center">
  <img src="docs/readme/divider.svg" alt="" width="100%">
  <br><br>
  <sub>If this saved you a few weekends, a star on the repository is a nice way to say so.</sub>
</p>
