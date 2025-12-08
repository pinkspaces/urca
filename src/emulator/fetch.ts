import { ok, Result } from "types/result";
import { InstructionSet } from "./instruction_set";
import { CoreState } from "./state";

export type Argument = ByteArgument | WordArgument | AddressArgument | MaxArgument | RegisterArgument | PortArgument;
export type ByteArgument = { type: "word", value: number };
export type WordArgument = { type: "word", value: number };
export type AddressArgument = { type: "address", value: number };
export type MaxArgument = { type: "max", value: number };
export type RegisterArgument = { type: "register", value: number };
export type PortArgument = { type: "port", value: number };
type Instruction = {
  name: string;
  arguments: Argument[];
}

export function fetch(core: CoreState): Result<Instruction, string> {
  const instruction_head = core.memoryctl.getInstruction(core.registers.address[0]);
  if (instruction_head.is_err()) return instruction_head;
  core.registers.address[0] += core.memoryctl.bitwidths.byte == 1 ? 2 : 1;
  const instruction_structure = InstructionSet[instruction_head.unwrap()];

  const fetched_instruction: Instruction = {
    name: instruction_structure.name,
    arguments: []
  };

  for (let i = 0; i < instruction_structure.argument_count; i++) {
    const type = instruction_structure.argument_types[i];
    switch (type.type) {
      case "port":
      case "register":
      case "word": {
        const v = core.memoryctl.getWord(core.registers.address[0]);
        if (v.is_err()) return v;
        fetched_instruction.arguments.push({
          type: type.type, value: v.unwrap()
        });
        core.registers.address[0] += core.memoryctl.bitwidths.word;
        break;
      };
      case "max":
      case "address": {
        const v = core.memoryctl.getAddress(core.registers.address[0]);
        if (v.is_err()) return v;
        fetched_instruction.arguments.push({
          type: type.type, value: v.unwrap()
        });
        core.registers.address[0] += core.memoryctl.bitwidths.address;
        break;
      }
    }
  }

  return ok(fetched_instruction);
}
