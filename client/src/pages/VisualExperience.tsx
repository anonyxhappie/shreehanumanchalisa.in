import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { verses } from "@/lib/hanumanChalisa";

const sceneTitles = [
  "Begin with a clear mind",
  "Ask for strength and wisdom",
  "The ocean of wisdom",
  "The messenger of Rama",
  "Courage guided by goodness",
  "A radiant golden presence",
  "Devotion without fear",
  "The power to protect",
  "Wisdom in every action",
  "A heart devoted to Rama",
  "Strength beyond measure",
  "A light across the worlds",
];

const palettes = [
  ["#081b2a", "#25485a", "#d88a4c", "#f5d6a0"],
  ["#101f35", "#55405a", "#d57a43", "#f6d9a1"],
  ["#091e31", "#245a63", "#e0a15a", "#ffe5b2"],
  ["#101a31", "#3b345b", "#c86c42", "#f8c985"],
  ["#10202b", "#5c3b2d", "#e09a50", "#ffe0a0"],
  ["#141a2b", "#6b3e37", "#f0a35c", "#ffe8b9"],
];

function drawScene(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  time: number,
  index: number,
  alpha: number,
  reduced: boolean,
) {
  const palette = palettes[index % palettes.length];
  ctx.save();
  ctx.globalAlpha = alpha;
  const bg = ctx.createLinearGradient(0, 0, w * 0.8, h);
  bg.addColorStop(0, palette[0]);
  bg.addColorStop(0.52, palette[1]);
  bg.addColorStop(1, palette[2]);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const drift = reduced ? 0 : time;
  const sx = w * (0.64 + Math.sin(drift * 0.12 + index) * 0.035);
  const sy = h * (0.38 + Math.cos(drift * 0.1 + index) * 0.025);
  const radius = Math.min(w, h) * 0.2;
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius * 2.4);
  glow.addColorStop(0, palette[3] + "d9");
  glow.addColorStop(0.24, palette[2] + "66");
  glow.addColorStop(1, palette[2] + "00");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  ctx.save();
  ctx.translate(sx, sy);
  ctx.rotate(reduced ? 0 : drift * 0.025);
  for (let ray = 0; ray < 72; ray++) {
    const angle = (Math.PI * 2 * ray) / 72;
    const inner = radius * (0.72 + (ray % 4) * 0.035);
    const outer = radius * (1.1 + (ray % 3) * 0.12);
    ctx.strokeStyle = palette[3] + (ray % 3 === 0 ? "35" : "18");
    ctx.lineWidth = ray % 6 === 0 ? 1.5 : 0.7;
    ctx.beginPath();
    ctx.moveTo(Math.cos(angle) * inner, Math.sin(angle) * inner);
    ctx.lineTo(Math.cos(angle) * outer, Math.sin(angle) * outer);
    ctx.stroke();
  }
  for (let ring = 0; ring < 7; ring++) {
    ctx.beginPath();
    ctx.arc(0, 0, radius * (0.48 + ring * 0.14) + (reduced ? 0 : Math.sin(drift * 0.6 + ring) * 3), 0, Math.PI * 2);
    ctx.strokeStyle = palette[3] + (ring === 0 ? "66" : "25");
    ctx.lineWidth = ring === 0 ? 1.5 : 0.8;
    ctx.stroke();
  }
  ctx.restore();

  // Layered hills move at different speeds to create depth.
  for (let layer = 0; layer < 3; layer++) {
    const y = h * (0.67 + layer * 0.105);
    const offset = reduced ? 0 : Math.sin(drift * (0.12 + layer * 0.04) + index) * 22;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, y);
    for (let point = 0; point <= 8; point++) {
      const x = (w / 8) * point;
      const peak = y - ((point + layer + index) % 3 === 0 ? h * (0.11 + layer * 0.02) : h * 0.025);
      ctx.lineTo(x + offset, peak);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = ["#091823d9", "#0b1b27cc", "#08141fc9"][layer];
    ctx.fill();
  }

  // A deliberately art-directed scene for each opening verse, then a distinct visual motif per verse.
  const scene = index % 8;
  const ground = h * 0.84;
  const motifX = w * (scene === 0 ? 0.34 : scene === 1 ? 0.66 : 0.7);
  const motifY = h * 0.64 + (reduced ? 0 : Math.sin(drift * 0.75 + index) * 5);

  // Temple steps and lotus geometry ground the devotional scenes.
  if (scene === 0 || scene === 1 || scene === 7) {
    const templeX = w * 0.29;
    const templeBase = ground + h * 0.04;
    ctx.save();
    ctx.translate(templeX, templeBase);
    ctx.fillStyle = "#101e29";
    ctx.fillRect(-w * 0.115, -h * 0.16, w * 0.23, h * 0.16);
    ctx.fillRect(-w * 0.085, -h * 0.24, w * 0.17, h * 0.09);
    ctx.beginPath();
    ctx.moveTo(-w * 0.12, -h * 0.24);
    ctx.lineTo(0, -h * 0.37);
    ctx.lineTo(w * 0.12, -h * 0.24);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = palette[3] + "80";
    ctx.lineWidth = 1.2;
    ctx.stroke();
    for (let step = 0; step < 3; step++) {
      ctx.fillStyle = ["#243a45", "#1a303c", "#122630"][step];
      ctx.fillRect(-w * (0.13 - step * 0.012), -step * h * 0.025, w * (0.26 - step * 0.024), h * 0.027);
    }
    // A small diya with a moving flame and warm pool of light.
    const flame = reduced ? 0 : Math.sin(drift * 4.2) * 2.6;
    const lampY = -h * 0.065;
    const lampGlow = ctx.createRadialGradient(0, lampY, 1, 0, lampY, h * 0.17);
    lampGlow.addColorStop(0, palette[3] + "75");
    lampGlow.addColorStop(1, palette[3] + "00");
    ctx.fillStyle = lampGlow;
    ctx.fillRect(-h * 0.18, lampY - h * 0.18, h * 0.36, h * 0.36);
    ctx.fillStyle = "#d88a4c";
    ctx.beginPath();
    ctx.ellipse(0, lampY + 7, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette[3];
    ctx.beginPath();
    ctx.moveTo(0, lampY + 5);
    ctx.bezierCurveTo(-8, lampY - 5 - flame, -1, lampY - 17 - flame, 2, lampY - 22 - flame);
    ctx.bezierCurveTo(12, lampY - 9 - flame, 7, lampY - 2, 0, lampY + 5);
    ctx.fill();
    ctx.restore();
  }

  if (scene === 0) {
    // The opening doha: a manuscript, lotus petals and a beam of dawn.
    const bookX = w * 0.59;
    const bookY = h * 0.75;
    ctx.save();
    ctx.translate(bookX, bookY);
    ctx.rotate(-0.045);
    const bookW = Math.min(w * 0.31, 340);
    const bookH = h * 0.19;
    ctx.shadowColor = "#00000066";
    ctx.shadowBlur = 30;
    ctx.fillStyle = "#5d3428";
    ctx.beginPath();
    ctx.moveTo(-bookW * 0.52, -bookH * 0.42);
    ctx.quadraticCurveTo(-bookW * 0.25, -bookH * 0.55, 0, -bookH * 0.38);
    ctx.quadraticCurveTo(bookW * 0.28, -bookH * 0.55, bookW * 0.52, -bookH * 0.42);
    ctx.lineTo(bookW * 0.5, bookH * 0.38);
    ctx.quadraticCurveTo(bookW * 0.23, bookH * 0.25, 0, bookH * 0.42);
    ctx.quadraticCurveTo(-bookW * 0.25, bookH * 0.25, -bookW * 0.5, bookH * 0.38);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#f2dfb6";
    ctx.beginPath();
    ctx.moveTo(-bookW * 0.48, -bookH * 0.38);
    ctx.quadraticCurveTo(-bookW * 0.22, -bookH * 0.47, -3, -bookH * 0.32);
    ctx.lineTo(-3, bookH * 0.32);
    ctx.quadraticCurveTo(-bookW * 0.25, bookH * 0.18, -bookW * 0.48, bookH * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(bookW * 0.48, -bookH * 0.38);
    ctx.quadraticCurveTo(bookW * 0.22, -bookH * 0.47, 3, -bookH * 0.32);
    ctx.lineTo(3, bookH * 0.32);
    ctx.quadraticCurveTo(bookW * 0.25, bookH * 0.18, bookW * 0.48, bookH * 0.3);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#b88951";
    ctx.lineWidth = 1;
    for (let line = 0; line < 4; line++) {
      const y = -bookH * 0.2 + line * bookH * 0.12;
      ctx.beginPath(); ctx.moveTo(-bookW * 0.39, y); ctx.lineTo(-bookW * 0.1, y + 2); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bookW * 0.1, y); ctx.lineTo(bookW * 0.39, y + 2); ctx.stroke();
    }
    ctx.restore();
    // Lotus blooms around the manuscript.
    for (let petal = 0; petal < 12; petal++) {
      const a = (Math.PI * 2 * petal) / 12 + (reduced ? 0 : Math.sin(drift * 0.4) * 0.025);
      ctx.save();
      ctx.translate(w * 0.59, h * 0.83);
      ctx.rotate(a);
      ctx.fillStyle = petal % 2 ? "#d98778" : "#e8ad91";
      ctx.beginPath();
      ctx.ellipse(0, -h * 0.045, w * 0.018, h * 0.052, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.fillStyle = "#e5bd72";
    ctx.beginPath(); ctx.arc(w * 0.59, h * 0.83, 8, 0, Math.PI * 2); ctx.fill();
  } else if (scene === 1) {
    // Hanuman seated in reverence: folded legs, joined hands, crown and ornaments.
    ctx.save();
    ctx.translate(motifX, motifY);
    const s = Math.min(w / 950, h / 640) * 1.25;
    ctx.scale(s, s);
    const gold = "#dba85d";
    const skin = "#bd6841";
    const cloth = "#b74b2f";
    const ink = "#17212a";
    const float = reduced ? 0 : Math.sin(drift * 0.9) * 3;
    ctx.translate(0, float);
    // Tail curls behind the body.
    ctx.strokeStyle = skin; ctx.lineWidth = 20; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-24, 62); ctx.bezierCurveTo(-135, 65, -145, -52, -72, -91); ctx.bezierCurveTo(-27, -116, -8, -85, -35, -71); ctx.stroke();
    ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(-34, -73, 8, 0, Math.PI * 2); ctx.fill();
    // Crossed legs and dhoti.
    ctx.fillStyle = cloth;
    ctx.beginPath(); ctx.moveTo(-49, 36); ctx.quadraticCurveTo(-99, 75, -95, 106); ctx.quadraticCurveTo(-30, 129, 0, 85); ctx.quadraticCurveTo(35, 130, 94, 105); ctx.quadraticCurveTo(82, 62, 40, 35); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = gold; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-65, 86); ctx.quadraticCurveTo(-12, 105, 0, 85); ctx.quadraticCurveTo(30, 109, 73, 84); ctx.stroke();
    // Torso and shoulders.
    ctx.fillStyle = skin; ctx.beginPath(); ctx.moveTo(-48, -25); ctx.quadraticCurveTo(-68, 16, -43, 57); ctx.quadraticCurveTo(0, 78, 43, 57); ctx.quadraticCurveTo(66, 12, 43, -25); ctx.closePath(); ctx.fill();
    // Arms rise toward joined palms.
    ctx.strokeStyle = skin; ctx.lineWidth = 17; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-37, -9); ctx.quadraticCurveTo(-53, -35, -25, -63); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(37, -9); ctx.quadraticCurveTo(53, -35, 25, -63); ctx.stroke();
    ctx.strokeStyle = gold; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.arc(-43, -23, 9, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(43, -23, 9, 0, Math.PI * 2); ctx.stroke();
    // Monkey-like face, ears, muzzle and eyes.
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, -79, 36, 42, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-35, -78, 10, 14, -0.3, 0, Math.PI * 2); ctx.ellipse(35, -78, 10, 14, 0.3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e8b28a"; ctx.beginPath(); ctx.ellipse(0, -65, 21, 15, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(-12, -86, 3.5, 0, Math.PI * 2); ctx.arc(12, -86, 3.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-8, -56); ctx.quadraticCurveTo(0, -50, 8, -56); ctx.stroke();
    // Crown, central jewel and tilak.
    ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(-29, -105); ctx.lineTo(-22, -135); ctx.lineTo(-7, -119); ctx.lineTo(0, -145); ctx.lineTo(8, -119); ctx.lineTo(23, -135); ctx.lineTo(30, -105); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#f4dfac"; ctx.beginPath(); ctx.arc(0, -119, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#f7e9c8"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -96); ctx.lineTo(0, -78); ctx.stroke();
    // Sacred necklace and chest pendant.
    ctx.strokeStyle = gold; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, -20, 29, 0.25, Math.PI - 0.25); ctx.stroke();
    ctx.fillStyle = "#f4d69b"; ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(8, 2); ctx.lineTo(0, 13); ctx.lineTo(-8, 2); ctx.closePath(); ctx.fill();
    ctx.restore();
  } else {
    // Verse-specific story landmarks keep the presentation from repeating one generic character.
    if (scene === 5) {
      // The Sanjeevani mountain: layered ridges, tiny trees, and a living green-gold aura.
      const mx = w * 0.28;
      const my = h * 0.61;
      const mountainGlow = ctx.createRadialGradient(mx, my, 2, mx, my, h * 0.3);
      mountainGlow.addColorStop(0, "#b5c87b55");
      mountainGlow.addColorStop(1, "#b5c87b00");
      ctx.fillStyle = mountainGlow;
      ctx.fillRect(mx - h * 0.3, my - h * 0.3, h * 0.6, h * 0.6);
      ctx.fillStyle = "#27483e";
      ctx.beginPath(); ctx.moveTo(mx - w * 0.2, my + h * 0.17); ctx.lineTo(mx - w * 0.14, my - h * 0.02); ctx.lineTo(mx - w * 0.08, my - h * 0.15); ctx.lineTo(mx - w * 0.025, my - h * 0.06); ctx.lineTo(mx + w * 0.045, my - h * 0.2); ctx.lineTo(mx + w * 0.16, my + h * 0.17); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#6f9364";
      for (let tree = 0; tree < 9; tree++) {
        const tx = mx - w * 0.13 + tree * w * 0.03;
        const ty = my + h * (tree % 3 === 0 ? -0.07 : tree % 2 === 0 ? 0.01 : -0.02);
        ctx.fillRect(tx - 1.5, ty, 3, h * 0.055);
        ctx.beginPath(); ctx.moveTo(tx, ty - h * 0.07); ctx.lineTo(tx - 8, ty + 3); ctx.lineTo(tx + 8, ty + 3); ctx.closePath(); ctx.fill();
      }
    }
    if (scene === 6) {
      // Rama's bow and a quiet royal silhouette create a distinct devotional tableau.
      const rx = w * 0.27;
      const ry = h * 0.65;
      ctx.strokeStyle = "#d9b777";
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(rx, ry - h * 0.24); ctx.quadraticCurveTo(rx + w * 0.1, ry, rx, ry + h * 0.17); ctx.stroke();
      ctx.strokeStyle = "#f0d8a7aa";
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(rx, ry - h * 0.24); ctx.lineTo(rx + w * 0.012, ry + h * 0.17); ctx.stroke();
      ctx.fillStyle = "#15222b";
      ctx.beginPath(); ctx.ellipse(rx - w * 0.035, ry - h * 0.19, w * 0.025, h * 0.055, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(rx - w * 0.065, ry - h * 0.13, w * 0.06, h * 0.18);
      ctx.strokeStyle = "#d9b777";
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(rx - w * 0.015, ry - h * 0.1); ctx.lineTo(rx + w * 0.055, ry + h * 0.02); ctx.stroke();
    }

    // Standing Hanuman with recognizable crown, expressive face, layered dhoti, jewellery and gada.
    ctx.save();
    ctx.translate(motifX, motifY);
    const s = Math.min(w / 900, h / 660) * (scene === 2 ? 1.28 : 1.16);
    ctx.scale(s, s);
    const gold = "#e2b567";
    const skin = scene === 5 ? "#d78b4c" : "#bb6842";
    const cloth = scene === 4 ? "#2e7776" : "#b8482d";
    const ink = "#111a22";
    const float = reduced ? 0 : Math.sin(drift * 0.82 + index) * 4;
    ctx.translate(0, float);
    if (scene === 3) ctx.rotate(reduced ? -0.28 : -0.28 + Math.sin(drift * 0.6) * 0.025);
    // Tail with curled tip, behind the figure.
    ctx.strokeStyle = skin; ctx.lineWidth = 19; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-27, 77); ctx.bezierCurveTo(-133, 75, -146, -37, -91, -75); ctx.bezierCurveTo(-52, -105, -29, -78, -51, -61); ctx.stroke();
    ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(-49, -64, 8, 0, Math.PI * 2); ctx.fill();
    // Legs and flowing dhoti.
    ctx.fillStyle = skin;
    ctx.beginPath(); ctx.moveTo(-24, 59); ctx.lineTo(-37, 143); ctx.quadraticCurveTo(-41, 163, -24, 168); ctx.lineTo(-7, 165); ctx.lineTo(0, 90); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(17, 59); ctx.lineTo(26, 140); ctx.quadraticCurveTo(25, 163, 43, 164); ctx.lineTo(57, 158); ctx.lineTo(42, 77); ctx.closePath(); ctx.fill();
    ctx.fillStyle = cloth; ctx.beginPath(); ctx.moveTo(-46, 4); ctx.quadraticCurveTo(-10, 18, 43, 0); ctx.lineTo(59, 75); ctx.lineTo(20, 61); ctx.lineTo(3, 106); ctx.lineTo(-16, 62); ctx.lineTo(-57, 80); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = gold; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-44, 11); ctx.quadraticCurveTo(0, 27, 43, 8); ctx.stroke();
    ctx.strokeStyle = "#eaa56b"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-17, 27); ctx.lineTo(-7, 72); ctx.moveTo(5, 25); ctx.lineTo(14, 67); ctx.stroke();
    // Torso, broad shoulders and upper arms.
    ctx.fillStyle = skin; ctx.beginPath(); ctx.moveTo(-43, -54); ctx.quadraticCurveTo(-62, -27, -47, 12); ctx.quadraticCurveTo(0, 36, 46, 10); ctx.quadraticCurveTo(59, -25, 39, -54); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = skin; ctx.lineWidth = 18; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-39, -40); ctx.quadraticCurveTo(-75, -13, -65, 20); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(38, -39); ctx.quadraticCurveTo(63, -18, 72, 4); ctx.stroke();
    // Gada shaft and ornate head.
    ctx.strokeStyle = "#5d3426"; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(70, 5); ctx.lineTo(106, -76); ctx.stroke();
    ctx.strokeStyle = gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(70, 5); ctx.lineTo(106, -76); ctx.stroke();
    ctx.fillStyle = "#a96535"; ctx.beginPath(); ctx.arc(111, -91, 23, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(111, -91, 17, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = gold; ctx.beginPath(); ctx.arc(111, -91, 7, 0, Math.PI * 2); ctx.fill();
    // Head and monkey-like facial features.
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(0, -81, 35, 41, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(-34, -80, 9, 13, -0.25, 0, Math.PI * 2); ctx.ellipse(34, -80, 9, 13, 0.25, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#efc49a"; ctx.beginPath(); ctx.ellipse(0, -66, 20, 14, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = ink; ctx.beginPath(); ctx.ellipse(-12, -86, 4, 5, 0, 0, Math.PI * 2); ctx.ellipse(12, -86, 4, 5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(-8, -56); ctx.quadraticCurveTo(0, -51, 8, -56); ctx.stroke();
    // Crown, tilak and layered jewellery.
    ctx.fillStyle = gold; ctx.beginPath(); ctx.moveTo(-29, -106); ctx.lineTo(-24, -133); ctx.lineTo(-10, -120); ctx.lineTo(0, -151); ctx.lineTo(10, -120); ctx.lineTo(24, -133); ctx.lineTo(29, -106); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#f6e7bf"; ctx.beginPath(); ctx.arc(0, -121, 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#fff0ca"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, -97); ctx.lineTo(0, -79); ctx.stroke();
    ctx.strokeStyle = gold; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(0, -27, 29, 0.15, Math.PI - 0.15); ctx.stroke();
    ctx.fillStyle = "#f4d69b"; ctx.beginPath(); ctx.moveTo(0, -14); ctx.lineTo(8, -3); ctx.lineTo(0, 9); ctx.lineTo(-8, -3); ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  // Foreground fireflies use stable paths so the motion feels continuous.
  for (let i = 0; i < 90; i++) {
    const phase = i * 2.399;
    const speed = 5 + (i % 5) * 2;
    const x0 = (Math.sin(phase) * 0.5 + 0.5) * w;
    const y0 = (Math.cos(phase * 1.73) * 0.5 + 0.5) * h;
    const x = (x0 + (reduced ? 0 : Math.sin(drift * 0.16 + phase) * 20 + drift * speed * (i % 2 ? 1 : -1)) + w * 4) % w;
    const y = (y0 - (reduced ? 0 : drift * speed * 0.22) + h * 4) % h;
    const pulse = reduced ? 0.6 : 0.4 + (Math.sin(drift * 1.4 + phase) + 1) * 0.3;
    ctx.fillStyle = palette[3] + (pulse > 0.72 ? "bb" : "66");
    ctx.beginPath();
    ctx.arc(x, y, i % 11 === 0 ? 2.1 : 0.8 + (i % 3) * 0.4, 0, Math.PI * 2);
    ctx.fill();
  }

  const vignette = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.12, w * 0.5, h * 0.5, Math.max(w, h) * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(3,10,17,.52)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

export default function VisualExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sectionsRef = useRef<Array<HTMLElement | null>>([]);
  const activeRef = useRef(0);
  const previousRef = useRef(0);
  const transitionStartRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const navigateTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(verses.length - 1, index));
    sectionsRef.current[next]?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
    setActiveIndex(next);
  }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !ctx) return;
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let time = 0;
    let last = performance.now();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const frame = (now: number) => {
      const delta = Math.min((now - last) / 1000, 0.04);
      last = now;
      if (!pausedRef.current && !motion.matches) time += delta;
      const current = activeRef.current;
      const previous = previousRef.current;
      const transition = Math.min(1, (now - transitionStartRef.current) / 1100);
      ctx.clearRect(0, 0, width, height);
      if (previous !== current && transition < 1) {
        drawScene(ctx, width, height, time, previous, 1 - transition, motion.matches);
        drawScene(ctx, width, height, time, current, transition, motion.matches);
      } else {
        drawScene(ctx, width, height, time, current, 1, motion.matches);
      }
      if (!motion.matches) raf = window.requestAnimationFrame(frame);
    };
    const resizeObserver = () => resize();
    resize();
    window.addEventListener("resize", resizeObserver);
    const onMotionChange = () => {
      if (raf) window.cancelAnimationFrame(raf);
      last = performance.now();
      raf = window.requestAnimationFrame(frame);
    };
    motion.addEventListener("change", onMotionChange);
    raf = window.requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("resize", resizeObserver);
      motion.removeEventListener("change", onMotionChange);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const best = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (!best) return;
      const next = Number(best.target.getAttribute("data-scene-index") ?? 0);
      if (next !== activeRef.current) {
        previousRef.current = activeRef.current;
        activeRef.current = next;
        transitionStartRef.current = performance.now();
        setActiveIndex(next);
      }
    }, { threshold: [0.25, 0.55, 0.8] });
    sectionsRef.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative isolate min-h-screen overflow-clip bg-[#081b2a] text-[#fff3dc]">
      <div className="pointer-events-none fixed inset-0 z-0">
        <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061522]/80 via-[#061522]/35 to-transparent" />
      </div>

      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
        <Link href="/" className="pointer-events-auto inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to reading
        </Link>
        <div className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-white/55 sm:flex"><Sparkles className="h-3.5 w-3.5" /> The living Chalisa</div>
        <button type="button" onClick={() => { pausedRef.current = !pausedRef.current; setPaused(pausedRef.current); }} className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-black/20 px-4 py-2 text-xs font-semibold text-white/85 backdrop-blur-md transition hover:bg-black/35" aria-label={paused ? "Resume animation" : "Pause animation"}>
          {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}{paused ? "Resume" : "Pause"}
        </button>
      </header>

      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-30 flex items-end justify-between gap-4 px-5 pb-5 sm:px-8 lg:px-12">
        <div className="pointer-events-auto max-w-[min(82vw,700px)]">
          <AnimatePresence mode="wait">
            <motion.div key={activeIndex} initial={{ opacity: 0, y: 22, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(4px)" }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
              <div className="mb-3 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] text-[#f3c987]">
                <span>{String(activeIndex + 1).padStart(2, "0")}</span><span className="h-px w-8 bg-[#f3c987]/55" /><span>Verse {verses[activeIndex]?.n}</span>
              </div>
              <p className="whitespace-pre-line font-serif text-2xl leading-relaxed drop-shadow-lg sm:text-3xl lg:text-4xl">{verses[activeIndex]?.hi}</p>
              <p className="mt-3 max-w-2xl text-xs leading-5 text-white/65 sm:text-sm">{verses[activeIndex]?.en}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="pointer-events-auto flex shrink-0 items-center gap-2 pb-1">
          <button type="button" onClick={() => navigateTo(activeIndex - 1)} disabled={activeIndex <= 0} aria-label="Previous verse" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur-md transition hover:bg-white/20 disabled:opacity-30"><ArrowLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => navigateTo(activeIndex + 1)} disabled={activeIndex >= verses.length - 1} aria-label="Next verse" className="grid h-11 w-11 place-items-center rounded-full bg-[#e18b48] text-[#171c20] transition hover:bg-[#f0a25e] disabled:opacity-30"><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-2 md:flex">
        <span className="mb-2 text-[10px] font-bold tracking-[0.2em] text-white/50 [writing-mode:vertical-rl]">SCROLL TO EXPERIENCE</span>
        <div className="h-36 w-px overflow-hidden bg-white/20"><div className="w-full bg-[#f0a25e] transition-[height] duration-700" style={{ height: `${((activeIndex + 1) / verses.length) * 100}%` }} /></div>
        <span className="mt-2 text-[10px] tabular-nums text-white/60">{String(activeIndex + 1).padStart(2, "0")} / {String(verses.length).padStart(2, "0")}</span>
      </div>

      {verses.map((verse, index) => (
        <section key={index} ref={(node) => { sectionsRef.current[index] = node; }} data-scene-index={index} className="relative z-10 flex min-h-[100svh] items-center px-5 pb-64 pt-24 sm:px-8 lg:px-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#061522]/30 via-transparent to-[#061522]/10" />
          <div className="relative max-w-xl opacity-0" aria-hidden="true">
            <p>{verse.hi}</p>
          </div>
          {index === 0 && <div className="pointer-events-none absolute bottom-32 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/55 md:flex"><ArrowDown className="h-3.5 w-3.5 animate-bounce" /> Scroll slowly</div>}
        </section>
      ))}
    </main>
  );
}
