---
title: PyLex
summary: A lexical analyzer for a small Python-like language, with a web front end that shows each token as you type.
repo: markjorias/PyLex
demo: https://pylex-flex.vercel.app
role: Solo project. Design, lexer and front end.
order: 1
---

## The problem

Our compiler design class needed a way to see how a lexer splits source code into tokens, without reading a wall of terminal output.

## What I built

A Python lexer behind a small Flask API, and a web page that highlights each token and its type as you type.

![Lexer output](/work/pylex/output.png)

## What I learned

Writing the token table first made the lexer and the UI agree on names, which saved a lot of rework.
