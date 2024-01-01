import { boot } from "quasar/wrappers";

import { defineRule, configure } from "vee-validate";
import { required, email, max } from "@vee-validate/rules";

// Add build-in rules
defineRule("required", required);
defineRule("email", email);

// Add custom rule
