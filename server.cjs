var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_url = require("url");
var import_mongodb = require("mongodb");
var import_pg = __toESM(require("pg"), 1);
var import_meta = {};
var { Client: PgClient } = import_pg.default;
var getModulePaths = () => {
  try {
    if (typeof import_meta !== "undefined" && import_meta.url) {
      const filename = (0, import_url.fileURLToPath)(import_meta.url);
      return {
        filename,
        dirname: import_path.default.dirname(filename)
      };
    }
  } catch (e) {
  }
  try {
    if (typeof module !== "undefined" && module.filename) {
      return {
        filename: module.filename,
        dirname: import_path.default.dirname(module.filename)
      };
    }
  } catch (e) {
  }
  return { filename: "", dirname: "" };
};
var { filename: __filename, dirname: __dirname } = getModulePaths();
var PORT = Number(process.env.PORT) || 3e3;
var DB_FILE = import_path.default.join(process.cwd(), "server_db.json");
var geminiApiKey = process.env.GEMINI_API_KEY;
var ai = null;
if (geminiApiKey) {
  try {
    ai = new import_genai.GoogleGenAI({
      apiKey: geminiApiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build"
        }
      }
    });
    console.log("Gemini AI successfully initialized server-side.");
  } catch (error) {
    console.error("Failed to initialize Gemini AI SDK:", error);
  }
} else {
  console.log("No GEMINI_API_KEY found in process.env. Running with regex parser fallback.");
}
var DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150"
];
var INITIAL_DB = {
  users: [
    {
      id: "admin-salah",
      username: "mohamedsalah",
      name: "Mr. Mohamed Salah",
      phone: "01001234567",
      password: "123",
      role: "admin",
      status: "active",
      avatar: "/src/assets/images/mohamed_salah_avatar_1783203726731.jpg",
      approvedUntil: "unlimited",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "admin-hagar",
      username: "hagarafifi",
      name: "Ms. Hagar Afifi",
      phone: "01007654321",
      password: "123",
      role: "admin",
      status: "active",
      avatar: "/src/assets/images/hagar_afifi_avatar_1783203738368.jpg",
      approvedUntil: "unlimited",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "teacher-ali",
      username: "mr_ali",
      name: "Mr. Ali Ahmed",
      phone: "01112223334",
      password: "123",
      role: "teacher",
      status: "active",
      avatar: DEFAULT_AVATARS[1],
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "student-seed-1",
      name: "Omar Hassan",
      phone: "01234567890",
      password: "123",
      role: "student",
      status: "active",
      grade: 10,
      avatar: DEFAULT_AVATARS[3],
      approvedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString(),
      // 30 days
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1e3).toISOString()
    },
    {
      id: "student-seed-2",
      name: "Yasmine Nour",
      phone: "01555666777",
      password: "123",
      role: "student",
      status: "pending",
      grade: 11,
      avatar: DEFAULT_AVATARS[4],
      approvedUntil: null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ],
  videos: [
    {
      id: "v1",
      title: "Present Simple vs Present Continuous",
      description: "An essential guide explaining the differences between both tenses with examples.",
      youtubeUrl: "https://www.youtube.com/watch?v=3S3U9vOnbFk",
      youtubeId: "3S3U9vOnbFk",
      grade: 10,
      visible: true,
      maxViews: 3,
      order: 1,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "v2",
      title: "Mastering the Passive Voice",
      description: "Detailed explanation of how to form passive voice in all English tenses.",
      youtubeUrl: "https://www.youtube.com/watch?v=pxbQ2U3Uv08",
      youtubeId: "pxbQ2U3Uv08",
      grade: 11,
      visible: true,
      maxViews: "unlimited",
      order: 2,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ],
  tests: [
    {
      id: "t1",
      title: "Grammar Quiz - Present Tenses",
      description: "Test your understanding of present simple and continuous tenses.",
      type: "drag-drop",
      content: JSON.stringify([
        {
          id: "q1",
          text: "She _____ to school every day by bus.",
          type: "multiple-choice",
          options: ["go", "goes", "is going", "went"],
          correctAnswer: "goes",
          points: 5
        },
        {
          id: "q2",
          text: "Look! It _____ outside.",
          type: "multiple-choice",
          options: ["rain", "rains", "is raining", "rained"],
          correctAnswer: "is raining",
          points: 5
        },
        {
          id: "q3",
          text: "They _____ (not play) football on Sundays.",
          type: "fill-blank",
          correctAnswer: "don't play",
          points: 5
        },
        {
          id: "q4",
          text: "English is an easy language to learn. (True or False)",
          type: "true-false",
          options: ["True", "False"],
          correctAnswer: "True",
          points: 5
        }
      ]),
      grade: 10,
      visible: true,
      maxAttempts: 2,
      order: 1,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "t2",
      title: "HTML Test - Direct Speech (Self-Checking File)",
      description: "A beautiful interactive custom exam formatted in clean HTML code.",
      type: "html",
      content: `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; padding: 15px; color: #1e293b; background: #f8fafc; }
    h2 { color: #2563eb; }
    .question { margin-bottom: 15px; background: white; padding: 12px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
    .btn { background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
    .btn:hover { background: #1d4ed8; }
    .result { margin-top: 15px; font-weight: bold; font-size: 1.1em; color: #16a34a; }
  </style>
</head>
<body>
  <h2>Reported Speech Mini-Test</h2>
  <div class="question">
    <p>1. He said, "I am tired." in reported speech is:</p>
    <label><input type="radio" name="q1" value="wrong"> He said that he is tired.</label><br>
    <label><input type="radio" name="q1" value="correct"> He said that he was tired.</label>
  </div>
  <div class="question">
    <p>2. She asked, "Where do you live?" in reported speech is:</p>
    <label><input type="radio" name="q2" value="correct"> She asked where I lived.</label><br>
    <label><input type="radio" name="q2" value="wrong"> She asked where did I live.</label>
  </div>
  <button class="btn" onclick="checkAnswers()">Submit Test</button>
  <div id="res" class="result"></div>

  <script>
    function checkAnswers() {
      let score = 0;
      let q1 = document.querySelector('input[name="q1"]:checked');
      let q2 = document.querySelector('input[name="q2"]:checked');
      if (q1 && q1.value === 'correct') score += 5;
      if (q2 && q2.value === 'correct') score += 5;
      
      document.getElementById('res').innerText = 'Your Score: ' + score + ' / 10';
      
      // Send the score back to the main application page
      window.parent.postMessage({
        type: 'html-test-submission',
        score: score,
        totalPoints: 10,
        answers: {
          q1: q1 ? q1.value : 'unanswered',
          q2: q2 ? q2.value : 'unanswered'
        }
      }, '*');
    }
  </script>
</body>
</html>`,
      grade: 11,
      visible: true,
      maxAttempts: 5,
      order: 2,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ],
  books: [
    {
      id: "b1",
      title: "Secondary Stage English Workbook",
      description: "Comprehensive exercise book targeting high school syntax, translation, and essays.",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      grade: 10,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ],
  words: [
    {
      id: "w1",
      word: "Accomplish",
      meaning: "To succeed in doing something, especially after a lot of work or effort.",
      translation: "\u064A\u064F\u0646\u062C\u0632 / \u064A\u062D\u0642\u0642",
      partOfSpeech: "verb",
      example: "She accomplished her goal of finishing the English test on time.",
      grade: 10,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "w2",
      word: "Inevitably",
      meaning: "In a way that cannot be avoided, prevented, or escaped.",
      translation: "\u0645\u062D\u062A\u0648\u0645 / \u0644\u0627 \u0645\u0641\u0631 \u0645\u0646\u0647",
      partOfSpeech: "adverb",
      example: "If you study hard, you will inevitably score highly on Mr. Mohamed Salah's tests.",
      grade: 11,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ],
  notifications: [
    {
      id: "n1",
      type: "student_registration",
      message: "New student registered: Yasmine Nour (Grade 11)",
      data: {
        studentId: "student-seed-2",
        studentName: "Yasmine Nour",
        studentPhone: "01555666777",
        grade: 11
      },
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ],
  studentLogs: [
    {
      id: "log1",
      userId: "student-seed-1",
      videoId: "v1",
      viewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString(),
      viewCount: 1
    }
  ],
  testAttempts: [
    {
      id: "att1",
      userId: "student-seed-1",
      testId: "t1",
      score: 15,
      totalPoints: 20,
      answers: {
        q1: "goes",
        q2: "is raining",
        q3: "don't play",
        q4: "False"
      },
      solvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString(),
      attemptNumber: 1
    }
  ],
  announcements: [
    {
      id: "ann-1",
      title: "\u062D\u0641\u0644 \u062A\u0643\u0631\u064A\u0645 \u0627\u0644\u0645\u062A\u0641\u0648\u0642\u064A\u0646 \u0627\u0644\u0633\u0646\u0648\u064A \u{1F389}",
      content: "\u064A\u0633\u0631 \u0625\u062F\u0627\u0631\u0629 \u0625\u0646\u062C\u0644\u0634 \u0647\u0627\u0648\u0633 \u0648\u0645\u0633\u062A\u0631 \u0645\u062D\u0645\u062F \u0635\u0644\u0627\u062D \u062F\u0639\u0648\u062A\u0643\u0645 \u0644\u062D\u0636\u0648\u0631 \u062D\u0641\u0644 \u062A\u0643\u0631\u064A\u0645 \u0627\u0644\u0637\u0644\u0627\u0628 \u0627\u0644\u0645\u062A\u0641\u0648\u0642\u064A\u0646 \u0641\u064A \u0627\u0645\u062A\u062D\u0627\u0646\u0627\u062A \u0627\u0644\u0634\u0647\u0631. \u0633\u064A\u062A\u0645 \u062A\u0648\u0632\u064A\u0639 \u0634\u0647\u0627\u062F\u0627\u062A \u062A\u0642\u062F\u064A\u0631 \u0648\u062C\u0648\u0627\u0626\u0632 \u0642\u064A\u0645\u0629 \u064A\u0648\u0645 \u0627\u0644\u062C\u0645\u0639\u0629 \u0627\u0644\u0642\u0627\u062F\u0645 \u0627\u0644\u0633\u0627\u0639\u0629 5 \u0645\u0633\u0627\u0621\u064B \u0628\u0627\u0644\u0633\u0646\u062A\u0631. \u062D\u0636\u0648\u0631\u0643\u0645 \u0634\u0631\u0641 \u0644\u0646\u0627!",
      grade: 10,
      type: "honor",
      visible: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    },
    {
      id: "ann-2",
      title: "\u0645\u0648\u0627\u0639\u064A\u062F \u0645\u0631\u0627\u062C\u0639\u0629 \u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0641\u0635\u0644 \u0627\u0644\u062F\u0631\u0627\u0633\u064A \u0627\u0644\u0623\u0648\u0644 \u{1F4DA}",
      content: "\u0646\u062D\u064A\u0637 \u0639\u0644\u0645 \u0637\u0644\u0627\u0628 \u0627\u0644\u0635\u0641 \u0627\u0644\u062B\u0627\u0646\u064A \u0627\u0644\u062B\u0627\u0646\u0648\u064A (\u0627\u0644\u0642\u0633\u0645 \u0627\u0644\u0639\u0644\u0645\u064A \u0648\u0627\u0644\u0623\u062F\u0628\u064A) \u0628\u0623\u0646 \u0627\u0644\u062D\u0635\u0629 \u0627\u0644\u0642\u0627\u062F\u0645\u0629 \u0633\u062A\u0643\u0648\u0646 \u0645\u0631\u0627\u062C\u0639\u0629 \u0634\u0627\u0645\u0644\u0629 \u0648\u0645\u0643\u062B\u0641\u0629 \u0639\u0644\u0649 \u0642\u0648\u0627\u0639\u062F \u0627\u0644\u0648\u062D\u062F\u0627\u062A \u0627\u0644\u0623\u0648\u0644\u0649 \u0648\u0627\u0644\u062B\u0627\u0646\u064A\u0629 \u0648\u0627\u0644\u062B\u0627\u0644\u062B\u0629. \u064A\u0631\u062C\u0649 \u0627\u0644\u062D\u0636\u0648\u0631 \u0645\u0628\u0643\u0631\u0627\u064B \u0645\u0639 \u0643\u062A\u0627\u0628 \u0627\u0644\u0634\u0631\u062D \u0627\u0644\u062E\u0627\u0635 \u0628\u0643.",
      grade: 11,
      type: "review",
      visible: true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }
  ],
  settings: {
    mohamedSalahPicture: "/src/assets/images/mohamed_salah_avatar_1783203726731.jpg",
    hagarAfifiPicture: "/src/assets/images/hagar_afifi_avatar_1783203738368.jpg"
  }
};
var dbCache = INITIAL_DB;
var isDbLoaded = false;
var dbType = "json";
var mongoClient = null;
var pgClient = null;
async function initDatabase() {
  const mongoUri = process.env.MONGODB_URI;
  const pgUri = process.env.DATABASE_URL;
  if (mongoUri) {
    try {
      console.log("Connecting to MongoDB database...");
      const client = new import_mongodb.MongoClient(mongoUri, { connectTimeoutMS: 5e3 });
      await client.connect();
      mongoClient = client;
      dbType = "mongodb";
      console.log("Successfully connected to MongoDB!");
      const db = client.db("education_platform");
      const collection = db.collection("app_state");
      const doc = await collection.findOne({ _id: "main_db" });
      if (doc && doc.data) {
        dbCache = doc.data;
        if (!dbCache.settings) {
          dbCache.settings = INITIAL_DB.settings;
        }
        console.log("Loaded database state from MongoDB.");
      } else {
        await collection.updateOne(
          { _id: "main_db" },
          { $set: { data: INITIAL_DB } },
          { upsert: true }
        );
        dbCache = INITIAL_DB;
        console.log("Initialized MongoDB with default database state.");
      }
      isDbLoaded = true;
      return;
    } catch (err) {
      console.error("Failed to connect to MongoDB, falling back to other methods:", err);
    }
  }
  if (pgUri) {
    try {
      console.log("Connecting to PostgreSQL database...");
      const client = new PgClient({
        connectionString: pgUri,
        connectionTimeoutMillis: 5e3,
        ssl: pgUri.includes("localhost") ? false : { rejectUnauthorized: false }
      });
      await client.connect();
      pgClient = client;
      dbType = "postgres";
      console.log("Successfully connected to PostgreSQL!");
      await client.query(`
        CREATE TABLE IF NOT EXISTS platform_data (
          key VARCHAR(50) PRIMARY KEY,
          value TEXT NOT NULL
        )
      `);
      const res = await client.query("SELECT value FROM platform_data WHERE key = $1", ["db_state"]);
      if (res.rows.length > 0) {
        dbCache = JSON.parse(res.rows[0].value);
        if (!dbCache.settings) {
          dbCache.settings = INITIAL_DB.settings;
        }
        console.log("Loaded database state from PostgreSQL.");
      } else {
        await client.query(
          "INSERT INTO platform_data (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2",
          ["db_state", JSON.stringify(INITIAL_DB)]
        );
        dbCache = INITIAL_DB;
        console.log("Initialized PostgreSQL table with default database state.");
      }
      isDbLoaded = true;
      return;
    } catch (err) {
      console.error("Failed to connect to PostgreSQL, falling back to local file:", err);
    }
  }
  dbType = "json";
  console.log("Using local JSON file for database persistence:", DB_FILE);
  if (!import_fs.default.existsSync(DB_FILE)) {
    import_fs.default.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), "utf-8");
    dbCache = INITIAL_DB;
  } else {
    try {
      const data = import_fs.default.readFileSync(DB_FILE, "utf-8");
      dbCache = JSON.parse(data);
      if (!dbCache.settings) {
        dbCache.settings = INITIAL_DB.settings;
        import_fs.default.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), "utf-8");
      }
    } catch (err) {
      console.error("Error reading database file, using INITIAL_DB:", err);
      dbCache = INITIAL_DB;
    }
  }
  isDbLoaded = true;
}
function readDb() {
  return dbCache;
}
function writeDb(data) {
  dbCache = data;
  if (dbType === "mongodb" && mongoClient) {
    const db = mongoClient.db("education_platform");
    const collection = db.collection("app_state");
    collection.updateOne(
      { _id: "main_db" },
      { $set: { data } },
      { upsert: true }
    ).catch((err) => {
      console.error("Failed to write database to MongoDB in background:", err);
    });
  } else if (dbType === "postgres" && pgClient) {
    pgClient.query(
      "INSERT INTO platform_data (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2",
      ["db_state", JSON.stringify(data)]
    ).catch((err) => {
      console.error("Failed to write database to PostgreSQL in background:", err);
    });
  } else {
    try {
      import_fs.default.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {
      console.error("Error writing database file:", err);
    }
  }
}
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json({ limit: "15mb" }));
  await initDatabase();
  const genId = () => Math.random().toString(36).substring(2, 11);
  app.post("/api/auth/login", (req, res) => {
    const { username, phone, password, role } = req.body;
    const db = readDb();
    let user;
    if (role === "student") {
      user = db.users.find((u) => u.phone === phone && u.password === password && u.role === "student");
    } else {
      user = db.users.find(
        (u) => (u.username === username || u.phone === phone) && u.password === password && (u.role === "teacher" || u.role === "admin")
      );
    }
    if (!user) {
      return res.status(401).json({ error: "Invalid login credentials." });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ error: "Your account is suspended. Please contact Mr. Mohamed Salah." });
    }
    res.json({ user });
  });
  app.post("/api/auth/register", (req, res) => {
    const { name, phone, password, grade, avatar } = req.body;
    const db = readDb();
    const existing = db.users.find((u) => u.phone === phone);
    if (existing) {
      return res.status(400).json({ error: "This phone number is already registered." });
    }
    const newStudent = {
      id: "student-" + genId(),
      name,
      phone,
      password,
      role: "student",
      status: "pending",
      grade: Number(grade),
      avatar: avatar || DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
      approvedUntil: null,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.users.push(newStudent);
    const newNotification = {
      id: "notif-" + genId(),
      type: "student_registration",
      message: `New student registered: ${name} (Grade ${grade})`,
      data: {
        studentId: newStudent.id,
        studentName: name,
        studentPhone: phone,
        grade: Number(grade)
      },
      read: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.notifications.unshift(newNotification);
    writeDb(db);
    res.status(201).json({ user: newStudent, message: "Registration submitted successfully. Waiting for teacher approval." });
  });
  app.get("/api/auth/me/:id", (req, res) => {
    const db = readDb();
    const user = db.users.find((u) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user });
  });
  app.post("/api/gemini/parse-test", async (req, res) => {
    const { testText } = req.body;
    if (!testText || typeof testText !== "string") {
      return res.status(400).json({ error: "testText is required." });
    }
    if (ai) {
      try {
        console.log("Sending parsing request to Gemini 3.5 Flash...");
        const prompt = `Parse the following raw English test text and convert it into a valid JSON array of questions.
Each question in the array MUST have the following structure:
{
  "id": "unique_string_id",
  "text": "The question text, possibly with blank spaces represented by _____",
  "type": "multiple-choice" | "true-false" | "fill-blank",
  "options": ["Option A", "Option B", "Option C", "Option D"], // Only include for multiple-choice and true-false
  "correctAnswer": "Exact correct option string or fill-blank text",
  "points": 5 // Number of points, default to 5
}

Return ONLY the raw JSON array. Do not put markdown blocks like \`\`\`json. Return only valid parsable JSON.

Here is the test content:
${testText}`;
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt
        });
        const rawText = response.text || "";
        console.log("Gemini raw response text:", rawText);
        let cleanJson = rawText.trim();
        if (cleanJson.startsWith("```")) {
          cleanJson = cleanJson.replace(/^```(json)?/, "").replace(/```$/, "").trim();
        }
        const parsedQuestions = JSON.parse(cleanJson);
        return res.json({ questions: parsedQuestions });
      } catch (err) {
        console.error("Gemini parsing error, falling back to regex:", err);
      }
    }
    console.log("Using robust regex fallback parser...");
    const questions = [];
    try {
      const lines = testText.split("\n");
      let currentQuestion = null;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const matchNum = line.match(/^(\d+)[.)]\s*(.*)/);
        if (matchNum) {
          if (currentQuestion) {
            questions.push(currentQuestion);
          }
          const text = matchNum[2].trim();
          currentQuestion = {
            id: "q-" + Math.random().toString(36).substring(2, 7),
            text,
            type: "multiple-choice",
            options: [],
            correctAnswer: "",
            points: 5
          };
        } else if (currentQuestion) {
          const optMatch = line.match(/^([a-dA-D])[.)]\s*(.*)/);
          if (optMatch) {
            currentQuestion.options.push(optMatch[2].trim());
            if (!currentQuestion.correctAnswer) {
              currentQuestion.correctAnswer = optMatch[2].trim();
            }
          } else if (line.toLowerCase().includes("true") || line.toLowerCase().includes("false")) {
            currentQuestion.type = "true-false";
            currentQuestion.options = ["True", "False"];
            currentQuestion.correctAnswer = line.toLowerCase().includes("true") ? "True" : "False";
          } else {
            currentQuestion.text += " " + line;
          }
        }
      }
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      if (questions.length === 0) {
        lines.filter((l) => l.trim()).forEach((l, idx) => {
          questions.push({
            id: "q-" + idx,
            text: l,
            type: "fill-blank",
            correctAnswer: "answer",
            points: 5
          });
        });
      }
      res.json({ questions });
    } catch (fallbackErr) {
      res.status(500).json({ error: "Could not parse test. Please format your text clearly." });
    }
  });
  app.get("/api/admin/users", (req, res) => {
    const db = readDb();
    res.json({ users: db.users });
  });
  app.post("/api/admin/users", (req, res) => {
    const { name, phone, password, role, grade, status, username, isTrial } = req.body;
    const db = readDb();
    const existing = db.users.find((u) => u.phone === phone);
    if (existing) {
      return res.status(400).json({ error: "Phone number already registered." });
    }
    const newUser = {
      id: (role === "teacher" || role === "admin" ? "teacher-" : "student-") + genId(),
      username: role !== "student" ? username || name.toLowerCase().replace(/\s+/g, "") : void 0,
      name,
      phone,
      password,
      role,
      status: status || "active",
      grade: role === "student" ? Number(grade) : void 0,
      avatar: DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)],
      approvedUntil: role === "student" ? "unlimited" : void 0,
      isTrial: role === "student" ? Boolean(isTrial) : void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.users.push(newUser);
    writeDb(db);
    res.status(201).json({ user: newUser });
  });
  app.put("/api/admin/users/:id", (req, res) => {
    const { name, phone, password, grade, status, approvedUntil, username, avatar, isTrial } = req.body;
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "User not found" });
    db.users[idx] = {
      ...db.users[idx],
      name: name !== void 0 ? name : db.users[idx].name,
      phone: phone !== void 0 ? phone : db.users[idx].phone,
      password: password !== void 0 ? password : db.users[idx].password,
      grade: grade !== void 0 ? Number(grade) : db.users[idx].grade,
      status: status !== void 0 ? status : db.users[idx].status,
      approvedUntil: approvedUntil !== void 0 ? approvedUntil : db.users[idx].approvedUntil,
      username: username !== void 0 ? username : db.users[idx].username,
      avatar: avatar !== void 0 ? avatar : db.users[idx].avatar,
      isTrial: isTrial !== void 0 ? Boolean(isTrial) : db.users[idx].isTrial
    };
    writeDb(db);
    res.json({ user: db.users[idx] });
  });
  app.delete("/api/admin/users/:id", (req, res) => {
    const db = readDb();
    const filtered = db.users.filter((u) => u.id !== req.params.id);
    if (filtered.length === db.users.length) {
      return res.status(404).json({ error: "User not found" });
    }
    db.users = filtered;
    writeDb(db);
    res.json({ message: "User deleted successfully." });
  });
  app.post("/api/admin/users/:id/approve", (req, res) => {
    const { duration } = req.body;
    const db = readDb();
    const idx = db.users.findIndex((u) => u.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Student not found" });
    let approvedUntil = "unlimited";
    if (duration === "1month") {
      approvedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1e3).toISOString();
    }
    db.users[idx].status = "active";
    db.users[idx].approvedUntil = approvedUntil;
    if (duration === "trial") {
      db.users[idx].isTrial = true;
    } else {
      db.users[idx].isTrial = false;
    }
    writeDb(db);
    res.json({ user: db.users[idx] });
  });
  app.get("/api/notifications", (req, res) => {
    const db = readDb();
    res.json({ notifications: db.notifications });
  });
  app.post("/api/notifications/:id/read", (req, res) => {
    const db = readDb();
    const notif = db.notifications.find((n) => n.id === req.params.id);
    if (notif) {
      notif.read = true;
      writeDb(db);
    }
    res.json({ success: true });
  });
  app.get("/api/videos", (req, res) => {
    const db = readDb();
    res.json({ videos: db.videos });
  });
  app.post("/api/videos", (req, res) => {
    const { title, description, youtubeUrl, grade, visible, maxViews, isTrial } = req.body;
    const db = readDb();
    let youtubeId = "";
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = youtubeUrl.match(regExp);
    if (match && match[2].length === 11) {
      youtubeId = match[2];
    } else {
      youtubeId = youtubeUrl;
    }
    const newVideo = {
      id: "v-" + genId(),
      title,
      description,
      youtubeUrl,
      youtubeId,
      grade: Number(grade),
      visible: visible !== void 0 ? visible : true,
      maxViews: maxViews !== void 0 ? maxViews : "unlimited",
      isTrial: isTrial !== void 0 ? Boolean(isTrial) : false,
      order: db.videos.length + 1,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.videos.push(newVideo);
    writeDb(db);
    res.status(201).json({ video: newVideo });
  });
  app.put("/api/videos/:id", (req, res) => {
    const { title, description, youtubeUrl, grade, visible, maxViews, isTrial } = req.body;
    const db = readDb();
    const idx = db.videos.findIndex((v) => v.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Video not found" });
    let youtubeId = db.videos[idx].youtubeId;
    if (youtubeUrl) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = youtubeUrl.match(regExp);
      if (match && match[2].length === 11) {
        youtubeId = match[2];
      } else {
        youtubeId = youtubeUrl;
      }
    }
    db.videos[idx] = {
      ...db.videos[idx],
      title: title !== void 0 ? title : db.videos[idx].title,
      description: description !== void 0 ? description : db.videos[idx].description,
      youtubeUrl: youtubeUrl !== void 0 ? youtubeUrl : db.videos[idx].youtubeUrl,
      youtubeId,
      grade: grade !== void 0 ? Number(grade) : db.videos[idx].grade,
      visible: visible !== void 0 ? visible : db.videos[idx].visible,
      maxViews: maxViews !== void 0 ? maxViews : db.videos[idx].maxViews,
      isTrial: isTrial !== void 0 ? Boolean(isTrial) : db.videos[idx].isTrial
    };
    writeDb(db);
    res.json({ video: db.videos[idx] });
  });
  app.post("/api/videos/order", (req, res) => {
    const { orderedIds } = req.body;
    const db = readDb();
    orderedIds.forEach((id, index) => {
      const video = db.videos.find((v) => v.id === id);
      if (video) {
        video.order = index + 1;
      }
    });
    db.videos.sort((a, b) => a.order - b.order);
    writeDb(db);
    res.json({ success: true, videos: db.videos });
  });
  app.delete("/api/videos/:id", (req, res) => {
    const db = readDb();
    db.videos = db.videos.filter((v) => v.id !== req.params.id);
    writeDb(db);
    res.json({ message: "Video deleted." });
  });
  app.post("/api/videos/:id/view", (req, res) => {
    const { userId } = req.body;
    const videoId = req.params.id;
    const db = readDb();
    const video = db.videos.find((v) => v.id === videoId);
    if (!video) return res.status(404).json({ error: "Video not found" });
    let log = db.studentLogs.find((l) => l.userId === userId && l.videoId === videoId);
    if (log) {
      if (video.maxViews !== "unlimited" && log.viewCount >= Number(video.maxViews)) {
        return res.status(403).json({ error: "You have exceeded the maximum views allowed for this video." });
      }
      log.viewCount += 1;
      log.viewedAt = (/* @__PURE__ */ new Date()).toISOString();
    } else {
      log = {
        id: "log-" + genId(),
        userId,
        videoId,
        viewedAt: (/* @__PURE__ */ new Date()).toISOString(),
        viewCount: 1
      };
      db.studentLogs.push(log);
    }
    writeDb(db);
    res.json({ success: true, viewCount: log.viewCount });
  });
  app.get("/api/tests", (req, res) => {
    const db = readDb();
    res.json({ tests: db.tests });
  });
  app.post("/api/tests", (req, res) => {
    const { title, description, type, content, grade, visible, maxAttempts, isTrial } = req.body;
    const db = readDb();
    const newTest = {
      id: "test-" + genId(),
      title,
      description,
      type,
      content,
      // JSON string for drag-drop, or raw HTML code
      grade: Number(grade),
      visible: visible !== void 0 ? visible : true,
      maxAttempts: maxAttempts !== void 0 ? maxAttempts : "unlimited",
      isTrial: isTrial !== void 0 ? Boolean(isTrial) : false,
      order: db.tests.length + 1,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.tests.push(newTest);
    writeDb(db);
    res.status(201).json({ test: newTest });
  });
  app.put("/api/tests/:id", (req, res) => {
    const { title, description, content, grade, visible, maxAttempts, isTrial } = req.body;
    const db = readDb();
    const idx = db.tests.findIndex((t) => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Test not found" });
    db.tests[idx] = {
      ...db.tests[idx],
      title: title !== void 0 ? title : db.tests[idx].title,
      description: description !== void 0 ? description : db.tests[idx].description,
      content: content !== void 0 ? content : db.tests[idx].content,
      grade: grade !== void 0 ? Number(grade) : db.tests[idx].grade,
      visible: visible !== void 0 ? visible : db.tests[idx].visible,
      maxAttempts: maxAttempts !== void 0 ? maxAttempts : db.tests[idx].maxAttempts,
      isTrial: isTrial !== void 0 ? Boolean(isTrial) : db.tests[idx].isTrial
    };
    writeDb(db);
    res.json({ test: db.tests[idx] });
  });
  app.post("/api/tests/order", (req, res) => {
    const { orderedIds } = req.body;
    const db = readDb();
    orderedIds.forEach((id, index) => {
      const test = db.tests.find((t) => t.id === id);
      if (test) {
        test.order = index + 1;
      }
    });
    db.tests.sort((a, b) => a.order - b.order);
    writeDb(db);
    res.json({ success: true, tests: db.tests });
  });
  app.delete("/api/tests/:id", (req, res) => {
    const db = readDb();
    db.tests = db.tests.filter((t) => t.id !== req.params.id);
    writeDb(db);
    res.json({ message: "Test deleted." });
  });
  app.post("/api/tests/:id/solve", (req, res) => {
    const { userId, score, totalPoints, answers } = req.body;
    const testId = req.params.id;
    const db = readDb();
    const test = db.tests.find((t) => t.id === testId);
    if (!test) return res.status(404).json({ error: "Test not found" });
    const previousAttempts = db.testAttempts.filter((a) => a.userId === userId && a.testId === testId);
    const attemptCount = previousAttempts.length;
    if (test.maxAttempts !== "unlimited" && attemptCount >= Number(test.maxAttempts)) {
      return res.status(403).json({ error: "You have reached the maximum number of attempts for this test." });
    }
    const newAttempt = {
      id: "att-" + genId(),
      userId,
      testId,
      score: Number(score),
      totalPoints: Number(totalPoints),
      answers: answers || {},
      solvedAt: (/* @__PURE__ */ new Date()).toISOString(),
      attemptNumber: attemptCount + 1
    };
    db.testAttempts.push(newAttempt);
    writeDb(db);
    res.status(201).json({ attempt: newAttempt });
  });
  app.get("/api/books", (req, res) => {
    const db = readDb();
    res.json({ books: db.books });
  });
  app.post("/api/books", (req, res) => {
    const { title, description, fileUrl, grade, type, htmlContent, isTrial } = req.body;
    const db = readDb();
    const newBook = {
      id: "b-" + genId(),
      title,
      description,
      fileUrl: fileUrl || "",
      grade: Number(grade),
      type: type || "pdf",
      htmlContent: htmlContent || "",
      isTrial: isTrial !== void 0 ? Boolean(isTrial) : false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.books.push(newBook);
    writeDb(db);
    res.status(201).json({ book: newBook });
  });
  app.delete("/api/books/:id", (req, res) => {
    const db = readDb();
    db.books = db.books.filter((b) => b.id !== req.params.id);
    writeDb(db);
    res.json({ message: "Book deleted." });
  });
  app.get("/api/words", (req, res) => {
    const db = readDb();
    res.json({ words: db.words });
  });
  app.post("/api/words", (req, res) => {
    const { word, meaning, translation, partOfSpeech, example, grade, type, htmlContent, isTrial } = req.body;
    const db = readDb();
    const newWord = {
      id: "w-" + genId(),
      word,
      meaning,
      translation: translation || "",
      partOfSpeech: partOfSpeech || "",
      example: example || "",
      grade: Number(grade),
      type: type || "word",
      htmlContent: htmlContent || "",
      isTrial: isTrial !== void 0 ? Boolean(isTrial) : false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.words.push(newWord);
    writeDb(db);
    res.status(201).json({ word: newWord });
  });
  app.delete("/api/words/:id", (req, res) => {
    const db = readDb();
    db.words = db.words.filter((w) => w.id !== req.params.id);
    writeDb(db);
    res.json({ message: "Word deleted." });
  });
  app.get("/api/announcements", (req, res) => {
    const db = readDb();
    res.json({ announcements: db.announcements || [] });
  });
  app.post("/api/announcements", (req, res) => {
    const { title, content, grade, type, visible } = req.body;
    const db = readDb();
    if (!db.announcements) db.announcements = [];
    const newAnnouncement = {
      id: "ann-" + genId(),
      title,
      content,
      grade: Number(grade),
      type: type || "general",
      visible: visible !== void 0 ? visible : true,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    db.announcements.push(newAnnouncement);
    writeDb(db);
    res.status(201).json({ announcement: newAnnouncement });
  });
  app.put("/api/announcements/:id", (req, res) => {
    const { title, content, grade, type, visible } = req.body;
    const db = readDb();
    if (!db.announcements) db.announcements = [];
    const idx = db.announcements.findIndex((a) => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: "Announcement not found" });
    db.announcements[idx] = {
      ...db.announcements[idx],
      title: title !== void 0 ? title : db.announcements[idx].title,
      content: content !== void 0 ? content : db.announcements[idx].content,
      grade: grade !== void 0 ? Number(grade) : db.announcements[idx].grade,
      type: type !== void 0 ? type : db.announcements[idx].type,
      visible: visible !== void 0 ? visible : db.announcements[idx].visible
    };
    writeDb(db);
    res.json({ announcement: db.announcements[idx] });
  });
  app.delete("/api/announcements/:id", (req, res) => {
    const db = readDb();
    if (!db.announcements) db.announcements = [];
    db.announcements = db.announcements.filter((a) => a.id !== req.params.id);
    writeDb(db);
    res.json({ message: "Announcement deleted." });
  });
  app.get("/api/logs", (req, res) => {
    const db = readDb();
    res.json({
      testAttempts: db.testAttempts,
      studentLogs: db.studentLogs,
      users: db.users,
      videos: db.videos,
      tests: db.tests,
      announcements: db.announcements || [],
      settings: db.settings
    });
  });
  app.get("/api/settings", (req, res) => {
    const db = readDb();
    res.json({ settings: db.settings });
  });
  app.put("/api/settings", (req, res) => {
    const { mohamedSalahPicture, hagarAfifiPicture } = req.body;
    const db = readDb();
    if (!db.settings) {
      db.settings = {
        mohamedSalahPicture: "/src/assets/images/mohamed_salah_avatar_1783203726731.jpg",
        hagarAfifiPicture: "/src/assets/images/hagar_afifi_avatar_1783203738368.jpg"
      };
    }
    if (mohamedSalahPicture !== void 0) db.settings.mohamedSalahPicture = mohamedSalahPicture;
    if (hagarAfifiPicture !== void 0) db.settings.hagarAfifiPicture = hagarAfifiPicture;
    writeDb(db);
    res.json({ settings: db.settings });
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`English House Portal running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
