import { Commands } from "./commands";
import { CommandArgs } from "./commandArgs";

describe("Abstract command impl", () => {
    class FailedCommandImpl extends Commands {
        args: CommandArgs = {} as CommandArgs;

        exec(): Promise<string> {
            return Promise.resolve("");
        }
    }

    it("should throw exception if class didnt override registryCommand", function () {
        try {
            FailedCommandImpl.registryCommand("EMPTY_COMMAND");
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });

    it("should throw exception if class didnt override build", function () {
        try {
            FailedCommandImpl.build({} as CommandArgs);
        } catch (e) {
            expect(e).toBeTruthy();
        }
    });
});