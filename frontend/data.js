/* ==========================================================
   data.js — এই ফাইলটাই তোমার পোর্টফোলিওর সব কনটেন্ট।
   নতুন কিছু যোগ করতে শুধু এখানে একটা { ... } ব্লক কপি করে বসাও।
   HTML বা JS এ হাত দিতে হবে না।
   অন্য ভাষার জন্য ঐচ্ছিক ফিল্ড: title_bn, desc_bn, title_de, desc_de ... (না দিলে ইংরেজি দেখাবে)
   ========================================================== */
window.DATA = {

  // ---- EDUCATION: [EDIT] করা জায়গাগুলো নিজের তথ্য দিয়ে বদলাও ----
  education: [
    {
      degree: "Diploma in Mechatronics Technology",
      place: "[EDIT] Your Institute Name",
      period: "[EDIT] 2024 – 2028",
      score: "[EDIT] CGPA 0.00 / 4.00 (current)",
      note: "Electronics, programming, CAD and automation fundamentals."
    }
  ],

  // ---- SKILLS: status = "Stable" | "Active Build" | "Research" ----
  skills: [
    { group: "Embedded & Power", icon: "fa-microchip", items: [
      ["Arduino", "Stable"], ["ESP32", "Active Build"], ["Battery Management (BMS)", "Active Build"],
      ["PCB Design", "Research"], ["Raspberry Pi", "Research"], ["PID Control", "Research"] ] },
    { group: "Software & Intelligence", icon: "fa-code", items: [
      ["C / C++", "Stable"], ["Python", "Active Build"], ["Linux (Ubuntu)", "Active Build"],
      ["HTML, CSS, JS, Bootstrap", "Stable"], ["ROS 2", "Research"], ["Machine Learning", "Research"] ] },
    { group: "Mechanical & Automation", icon: "fa-industry", items: [
      ["Fusion 360 (CAD)", "Active Build"], ["CNC & G-Code", "Research"], ["PLC Logic", "Research"] ] }
  ],

  // ---- PROJECTS: category = "Robotics" | "Hardware" (নতুন নাম দিলে নতুন ফিল্টার তৈরি হবে) ----
  // status: "Planning" | "Building" | "Completed"
  projects: [
    {
      title: "Multi-Servo Spider Platform", icon: "fa-spider", category: "Robotics", status: "Planning",
      desc: "A 12-servo biomimetic walker to study servo synchronization, gait stability and power distribution.",
      tags: ["Arduino Nano", "PCA9685", "MG996R"],
      bom: ["Arduino Nano (core logic)", "12x MG996R servos", "PCA9685 servo driver"],
      image: "", github: "", video: ""
    },
    {
      title: "Li-ion Power & BMS Module", icon: "fa-battery-three-quarters", category: "Hardware", status: "Building",
      desc: "A 3S 18650 battery pack with BMS protection and a buck converter, built to power heavy servo loads.",
      tags: ["3S Li-ion", "20A BMS", "LM2596"],
      bom: ["3S 18650 cells", "20A BMS board", "LM2596 buck converter"],
      image: "", github: "", video: ""
    }
  ],

  // ---- ACTIVITIES: ভবিষ্যতের কম্পিটিশন, ওয়ার্কশপ, সার্টিফিকেট, অ্যাওয়ার্ড এখানে ----
  // type = "Competition" | "Workshop" | "Certificate" | "Award" | "Club" (নতুন type দিলেও চলবে)
  // সবচেয়ে নতুনটা উপরে বসাও
  activities: [
    {
      date: "2026-01", type: "Competition",
      title: "[EXAMPLE] Robotics Competition Name",
      org: "Organizer / City",
      result: "Participant (or: 2nd place, Finalist ...)",
      desc: "What your team built, your role, and what you learned.",
      link: "", image: ""
    }
  ],

  // ---- ROADMAP ----
  roadmap: [
    { stage: "Diploma", period: "Now", goal: "Build a strong base in electronics, embedded systems and programming. Finish 2–3 documented projects and join robotics competitions." },
    { stage: "BSc", period: "After diploma", goal: "Mechatronics / Robotics. Target merit scholarships and exchange programs." },
    { stage: "MSc", period: "Future", goal: "Robotics and autonomous systems with a research focus." },
    { stage: "PhD", period: "Future", goal: "Research in robotics and open-source contributions (ROS 2)." }
  ],

  contact: { email: "[EDIT] your.email@example.com", github: "https://github.com/Mishanchakma", linkedin: "https://www.linkedin.com/in/mishan-chakma-9a454428a/" }
};