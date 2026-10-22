import type { Works } from "./types";

/** Fictional content used only when PORTFOLIO_DEMO=1. */
export function getDemoWorks(): Works {
  return {
    status: "ok",
    isDemo: true,
    featured: [
      {
        slug: "campus-connect",
        title: "Campus Connect",
        summary: "A sample campus bulletin that brings events, student groups, and useful announcements into one calm, searchable space.",
        repo: "",
        demoUrl: null,
        role: "Sample scope: interface design and Flask development",
        cover: null,
        order: 1,
        isDemo: true,
        body: `This is a fictional case study for previewing the portfolio. It describes a hypothetical project, not completed work.

## The scenario

Imagine a student looking for a workshop while campus announcements are spread across several group chats. The concept would give those announcements a shared home, with clear dates and a consistent event format.

## The proposed approach

A Flask application with a PostgreSQL database could store events and student groups. An HTML and CSS interface would let visitors browse by date or topic, then open an event for its location, organizer, and registration details.

The design would prioritize a readable event list on a phone. A simple submission form could help organizers include the details students need before publishing an announcement.

## What to validate

A prototype study could ask students to find an upcoming workshop and identify where it takes place. The next iteration would depend on where they hesitate, whether the filters make sense, and whether the event details answer their questions.

## Next steps

This sample has no live application, repository, or measured results. A real case study would replace these assumptions with project screenshots, implementation decisions, and findings from testing.`,
      },
    ],
    projects: [
      {
        name: "StudySpace",
        fullName: "demo/StudySpace",
        description: "A study-planner concept for organizing subjects, upcoming deadlines, and focused sessions in one weekly view.",
        language: "Python",
        topics: ["flask", "postgresql", "html", "css"],
        repoUrl: "",
        demoUrl: null,
        pushedAt: "",
      },
      {
        name: "TokenLab",
        fullName: "demo/TokenLab",
        description: "An educational sandbox concept that would turn a small code sample into readable tokens and explain each token type.",
        language: "Python",
        topics: ["flask", "lexer", "education"],
        repoUrl: "",
        demoUrl: null,
        pushedAt: "",
      },
      {
        name: "Field Notes",
        fullName: "demo/Field-Notes",
        description: "A lightweight journal concept for collecting observations, sorting entries by topic, and revisiting useful notes.",
        language: "HTML",
        topics: ["css", "supabase", "interface-design"],
        repoUrl: "",
        demoUrl: null,
        pushedAt: "",
      },
    ],
  };
}
