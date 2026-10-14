import assert from "node:assert";
import { generateSpkNumber, formatRupiah } from "../src/lib/utils";
import { hashPassword, comparePassword } from "../src/lib/auth";
import { MEASUREMENT_DICTIONARY, STAGES_CONFIG } from "../src/lib/constants";

async function runSelfChecks() {
  console.log("🧪 Running unit and logic self-checks...");

  // 1. SPK Number format check
  const spk = generateSpkNumber();
  assert.match(spk, /^SPK-\d{4}-\d{4}$/, "SPK number must match format SPK-YYMM-XXXX");
  console.log("  ✓ SPK generator format correct:", spk);

  // 2. formatRupiah check
  const formatted = formatRupiah(175000);
  assert.ok(formatted.includes("175.000") || formatted.includes("Rp"), "formatRupiah must format IDR");
  console.log("  ✓ formatRupiah output correct:", formatted);

  // 3. Auth password hashing check
  const pass = "secret123";
  const hash = await hashPassword(pass);
  const isValid = await comparePassword(pass, hash);
  const isInvalid = await comparePassword("wrongpass", hash);
  assert.strictEqual(isValid, true, "Valid password must match hash");
  assert.strictEqual(isInvalid, false, "Invalid password must not match hash");
  console.log("  ✓ Password hashing and verification working.");

  // 4. Production stages consistency check
  assert.strictEqual(STAGES_CONFIG.length, 5, "Must have exactly 5 standard garment stages");
  assert.deepStrictEqual(
    STAGES_CONFIG.map((s) => s.key),
    ["cutting", "sewing", "qc", "packing", "ready"],
    "Stages must be cutting -> sewing -> qc -> packing -> ready"
  );
  console.log("  ✓ Production stages order and keys verified.");

  // 5. Measurement dictionary presence
  assert.ok(MEASUREMENT_DICTIONARY["lingkar_dada"], "lingkar_dada must be present");
  assert.ok(MEASUREMENT_DICTIONARY["panjang_celana"], "panjang_celana must be present");
  console.log("  ✓ Measurement dictionary definitions verified.");

  console.log("\n🎉 ALL SELF-CHECKS PASSED!");
}

runSelfChecks().catch((err) => {
  console.error("❌ Self-check failed:", err);
  process.exit(1);
});
