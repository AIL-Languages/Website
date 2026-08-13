import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  parseSelfServeRole,
  canAccessCoordination,
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

describe("canAccessCoordination", () => {
  it("oculta Coordinación académica a visitantes de rol alumno, profesor y empresa", () => {
    assert.equal(canAccessCoordination("teacher", "profe@example.com"), false);
    assert.equal(canAccessCoordination("student", "alumno@example.com"), false);
    assert.equal(canAccessCoordination("company", "empresa@example.com"), false);
  });

  it("muestra Coordinación académica a coordinadores y a la administradora", () => {
    assert.equal(canAccessCoordination("coordinator", "coord@example.com"), true);
    assert.equal(
      canAccessCoordination("admin", "ainman.languages@gmail.com"),
      true,
    );
    assert.equal(canAccessCoordination("admin", "otro.admin@example.com"), false);
  });
});
