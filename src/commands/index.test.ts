import { isArray } from "lodash";
import commands from "./index";

describe("index", () => {
    it("should be an array", function () {
        expect(isArray(commands)).toBeTruthy();
    });
});