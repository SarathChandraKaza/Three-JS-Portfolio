
🚀 ThreeJS + Vite Interactive Portfolio
XR / VR Project Showcase by Sarath Chandra

This is an interactive 3D portfolio built using Three.js + React Three Fiber + Vite, 
where each planet represents a project. Users navigate between projects by scrolling.

The Sun acts as the central light source and is not a project.

------------------------------------------------------------

PREREQUISITES

Make sure you have Node.js installed:
https://nodejs.org/en/download/

Check installation:
node -v
npm -v

------------------------------------------------------------

INSTALLATION

After cloning or downloading the repository, open a terminal inside the project folder and run:

npm install

This installs all dependencies.

------------------------------------------------------------

RUNNING THE PROJECT (DEVELOPMENT MODE)

npm run dev

This starts the local development server.
- Opens automatically in browser
- Hot reload enabled
- Used for testing changes

------------------------------------------------------------

BUILDING THE PROJECT (PRODUCTION)

npm run build

This generates optimized production files inside:
docs/
or
dist/
(depending on your Vite configuration)

These files are deployed to GitHub Pages.

------------------------------------------------------------

DEPLOYMENT (GITHUB PAGES WITH ACTIONS)

This project uses GitHub Actions for automatic deployment.

You DO NOT need to manually upload build files.

Deployment workflow:
1. Make changes
2. Test locally (npm run dev)
3. Commit
4. Push

git add .
git commit -m "Update portfolio"
git push

GitHub Actions will:
- Install dependencies
- Run npm run build
- Deploy automatically

------------------------------------------------------------

PORTFOLIO ARCHITECTURE

Each planet represents one project.

Important files:
- planetData.js
- Scene.jsx
- Project-Images/
- textures/

------------------------------------------------------------

HOW TO ADD A NEW PROJECT (NEW PLANET)

Step 1 — Add Planet Object

Open: src/data/planetData.js

Add new planet BEFORE the Sun.

Example:

{
  name: "Neptune",
  radius: 2.5,
  distance: 175,
  texturePath: `${import.meta.env.BASE_URL}textures/2k_neptune.jpg`,
  projectData: {
    projectName: "New Project",
    time: "2026",
    description: "Project description here",
    technologies: "Unity, XR",
    links: "https://...",
    images: [
      `${import.meta.env.BASE_URL}Project-Images/NewProject/image1.png`
    ]
  }
}

IMPORTANT:
- Keep Sun as the last object.
- Distance must increase by 25 from the previous planet.

------------------------------------------------------------

Step 2 — Add Images to Preload List

Open: Scene.jsx

Find:
const assetUrls = {
  images: [

Add your new images:
`${import.meta.env.BASE_URL}Project-Images/NewProject/image1.png`,

If you skip this, loading screen may break.

------------------------------------------------------------

Step 3 — Add Texture to Preload (If New Texture Used)

Inside:
assetUrls.textures

Add:
`${import.meta.env.BASE_URL}textures/2k_neptune.jpg`,

------------------------------------------------------------

Step 4 — Update TotalNumberOfPlanetsAndProjects

If you have:
const TotalNumberOfPlanetsAndProjects = 6;

Increase it to match new project count.


------------------------------------------------------------

Step 5 — Test Locally

npm run dev

Check:
- Scroll navigation
- Project opens correctly
- Images load
- Close button works

------------------------------------------------------------

Step 6 — Build and Push

npm run build
git add .
git commit -m "Added new project"
git push

GitHub Actions will deploy automatically.

------------------------------------------------------------

HOW TO UPDATE AN EXISTING PROJECT

1. Modify data in planetData.js
2. If adding new images → add to preload list
3. Test locally
4. Build
5. Push

------------------------------------------------------------

PLANET RULES

- Order in planetData.js = Navigation order
- Distance must increase by 25
- Sun must remain last
- Only planets with projectData are clickable

------------------------------------------------------------

COMMON MISTAKES

- Forgetting to update total count
- Moving Sun from last position
- Not preloading new images
- Wrong texture path
- Hardcoding wrong indices

------------------------------------------------------------

TECH STACK

- React
- React Three Fiber
- Three.js
- GSAP
- Vite
- GitHub Actions
- GitHub Pages

------------------------------------------------------------

Contact:
Sarath Chandra
XR Developer | Unity | VR | Interactive Systems
