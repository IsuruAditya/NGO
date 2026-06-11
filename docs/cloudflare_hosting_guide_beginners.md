# Cloudflare Hosting & Deployment Guide (For Beginners)

This guide walks you through setting up and deploying the EcoAlliance NGO website onto Cloudflare hosting. It assumes you have **no technical background** and have never worked with databases, Stripe, or server code before. 

Follow these instructions step-by-step to get the website live on your own Cloudflare account.

---

## What is Cloudflare?
Imagine your website is a book. Typically, to let others read it, you store it on one computer (a server). 
**Cloudflare** is a service that copies your website to hundreds of computers around the world. When someone visits, they download the website from the computer closest to them, making it load instantly. The database (D1) acts like a digital filing cabinet storing program details and volunteer signups.

All of this fits within Cloudflare's **100% Free Tier**, meaning you will not pay hosting fees.

---

## Step 1: Install the Required Tools
Before we start, your computer needs two free tools to compile the website files and send them to Cloudflare:

1.  **Node.js**:
    *   Go to [nodejs.org](https://nodejs.org/).
    *   Download the **LTS (Long Term Support)** version.
    *   Run the installer and click **Next** through all prompts (use default options).
2.  **Git** (needed for code tracking):
    *   Go to [git-scm.com](https://git-scm.com/).
    *   Download the installer for Windows/Mac and install it with default options.

---

## Step 2: Set Up Stripe (For Donations)
We use Stripe to process secure credit card donations.

1.  **Create an Account**: Go to [stripe.com](https://stripe.com) and sign up for a free account.
2.  **Activate Test Mode**: In the top right corner of your Stripe Dashboard, toggle the switch to **Test Mode**. (This lets you test donations without charging real credit cards).
3.  **Get your Secret Key**:
    *   In the search bar at the top of the Stripe dashboard, type **API Keys** and click the result.
    *   Look for the row labeled **Secret Key**.
    *   Click **Reveal test key token**.
    *   It will start with `sk_test_...`. Copy this long key and save it somewhere safe. You will need it in Step 5.

---

## Step 3: Create a Free Cloudflare Account
1.  Go to [cloudflare.com](https://dash.cloudflare.com/sign-up).
2.  Enter your email and choose a secure password, then click **Sign Up**.
3.  Open your email inbox, find the verification mail from Cloudflare, and click the link to confirm your account.
4.  Log in to your new Cloudflare Dashboard.

---

## Step 4: Open Your Terminal & Navigate
A "Terminal" (or Command Prompt) is a window where you type text commands to your computer instead of clicking buttons.

1.  **Open the Terminal**:
    *   **On Windows**: Press the `Windows Key`, type **cmd** or **Git Bash**, and press Enter.
    *   **On Mac**: Press `Command + Spacebar`, type **Terminal**, and press Enter.
2.  **Go to the Project Folder**:
    Type the command below to tell the terminal to look inside your website folder (replace the path with your actual folder location if different):
    ```bash
    cd c:/Biaferose/Maben/Sheikha/Antigravity/NGO
    ```
    *Press Enter. You are now inside the folder.*

---

## Step 5: Initialize the Database on Cloudflare
We will now create the live database "filing cabinet" in your Cloudflare account.

1.  **Log in to Cloudflare**:
    Type the command below in the terminal and press Enter:
    ```bash
    npx wrangler login
    ```
    *A web browser window will pop up. Click the blue **Allow** button to link your computer to your Cloudflare account.*
2.  **Create the Database**:
    Type this command in the terminal and press Enter:
    ```bash
    npx wrangler d1 create ngo-db
    ```
    *The terminal will output details. Look for the line that says `database_id = "..."`. Copy that long ID (e.g. `abcde123-4567-890a-bcde-f1234567890a`).*
3.  **Update Configuration File**:
    *   Open your project folder in your computer's file explorer.
    *   Open the file called `wrangler.jsonc` using Notepad or any text editor.
    *   Find the line that says `"database_id": "9e0a8857-98ed-4d8d-ab55-29374a4b3f8b"`.
    *   Delete the old ID and paste your new database ID inside the quotes.
    *   Save and close the file.

---

## Step 6: Load the Database and Set Secrets
We need to create the table structure (drawers) in your database, fill it with initial programs, and set your Stripe key.

1.  **Build Database Tables**:
    Copy and paste this command, then press Enter:
    ```bash
    npx wrangler d1 execute ngo-db --remote --file=./schema.sql
    ```
    *When asked "Ok to proceed?", type **yes** and press Enter.*
2.  **Add Initial Content**:
    Copy and paste this command, then press Enter:
    ```bash
    npx wrangler d1 execute ngo-db --remote --file=./seed.sql
    ```
    *Type **yes** and press Enter when prompted.*
3.  **Save your Stripe Key to Cloudflare**:
    Type this command and press Enter:
    ```bash
    npx wrangler secret put STRIPE_SECRET_KEY
    ```
    *The terminal will say: `Enter a secret value:`. Paste your Stripe Secret Key (starting with `sk_test_...` from Step 2) and press Enter.*
    *If asked "Do you want to create a new Worker...?", type **yes** and press Enter.*

---

## Step 7: Build and Deploy the Website
Now we compile all your code and upload the website files to Cloudflare.

1.  **Deploy Command**:
    Type this command in the terminal and press Enter:
    ```bash
    npm run deploy
    ```
    *Your computer will compile the React Router frontend and API server, package the files, and upload them.*
2.  **Get Your Live URL**:
    When the process completes (which takes about 20-30 seconds), the terminal will print:
    ```text
    Deployed react-router-app triggers
      https://react-router-app.xxxx.workers.dev
    ```
    Copy that URL. That is your live website! Open it in any browser or share it with anyone in the world.

---

## Troubleshooting Tips for Beginners
*   **"npx: command not found" or "npm: command not found"**:
    This means Node.js is not installed correctly, or you opened the terminal *before* installing Node.js. Close your terminal, make sure Node.js is installed, and open a new terminal window.
*   **"Wrangler login fails to open browser"**:
    If the browser does not open automatically, copy the URL displayed in the terminal window, paste it manually into your web browser, and log in.
*   **Wrong directory error**:
    If you get errors about missing files (like `schema.sql` not found), make sure you ran `cd c:/Biaferose/Maben/Sheikha/Antigravity/NGO` first, so the terminal is looking at the correct folder.
