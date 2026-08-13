import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseSelfServeRole,
  canCoordinate,
  canManageSystem,
} from "./admin.ts";

describe("parseSelfServeRole", () => {
  it("nunca ofrece coordinación ni docente en autoservicio", () => {
    assert.equal(parseSelfServeRole("coordinator"), "student");
    assert.equal(parseSelfServeRole("coordinacion"), "student");
    assert.equal(parseSelfServeRole("coordinacion academica"), "student");
    assert.equal(parseSelfServeRole("profesor"), "student");
    assert.equal(parseSelfServeRole("teacher"), "student");
    assert.equal(parseSelfServeRole("empresa"), "company");
    assert.equal(parseSelfServeRole("alumno"), "student");
  });
});

describe("canCoordinate", () => {
  it("solo autoriza a coordinadores y a la administradora", () => {
    assert.equal(canCoordinate("coordinator", "coord@example.com"), true);
    assert.equal(canManageSystem("admin", "ainman.languages@gmail.com"), true);
    assert.equal(canCoordinate("admin", "ainman.languages@gmail.com"), true);
    assert.equal(canCoordinate("teacher", "profe@example.com"), false);
    assert.equal(canCoordinate("student", "alumno@example.com"), false);
    assert.equal(canCoordinate("company", "empresa@example.com"), false);
  });
});
