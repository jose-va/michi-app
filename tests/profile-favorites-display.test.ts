import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";

const tabsSource = readFileSync(
  new URL("../common/components/layout/user/UserProfileTabs.tsx", import.meta.url),
  "utf8",
);

test("favoritos muestra el número de piezas junto al nombre", () => {
  assert.ok(
    tabsSource.includes("product.pieces"),
    "UserProfileTabs debe usar product.pieces",
  );
  assert.ok(
    tabsSource.includes("pieza"),
    "UserProfileTabs debe mostrar «pieza» en singular",
  );
  assert.ok(
    tabsSource.includes("piezas"),
    "UserProfileTabs debe mostrar «piezas» en plural",
  );
});

test("favoritos muestra badge miniatura de categoría junto al nombre japonés", () => {
  assert.ok(
    tabsSource.includes("@/common/mappers/badge.mapper"),
    "UserProfileTabs debe importar desde badge.mapper",
  );
  assert.ok(
    tabsSource.includes("getCategoryBadge"),
    "UserProfileTabs debe usar getCategoryBadge",
  );
  assert.ok(
    tabsSource.includes("@/common/mappers/category.mapper"),
    "UserProfileTabs debe importar desde category.mapper",
  );
  assert.ok(
    tabsSource.includes("getCategoryTitle(product.category)"),
    "UserProfileTabs debe renderizar getCategoryTitle(product.category)",
  );
  assert.ok(
    tabsSource.includes("product.japaneseName"),
    "UserProfileTabs debe mantener el nombre japonés",
  );
});
