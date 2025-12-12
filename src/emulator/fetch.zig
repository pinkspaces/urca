const std = @import("std");
const emulator = @import("./state.zig");
const instructions = @import("./instructions.zig");

const allocator = std.heap.page_allocator;
const InCode = instructions.InCode;
const Core = emulator.Core;

fn Instruction(comptime WordType: type, comptime AddrType: type) type {
    return struct {
        name: InCode,
        arguments: []InstructionArgument(WordType, AddrType)
    };
}

fn InstructionArgument(comptime WordType: type, comptime AddrType: type) type {
    return union(instructions.InstructionArgumentType) {
        REGISTER: struct {
            value: WordType
        },
        WORD: struct {
            value: WordType
        },
        ADDRESS: struct {
            value: AddrType
        },
        PORT: struct {
            value: WordType
        },
    };
}

pub fn fetch(comptime ByteType: type, comptime WordType: type, comptime AddrType: type, core: *Core(ByteType, WordType, AddrType)) !*Instruction(WordType, AddrType) {
    const byteBitwidth = @bitSizeOf(ByteType);
    const instructionLength = instructions.Instructions.len;
    const toFloor: f64= @floatFromInt(instructionLength);
    const opcodeBitwidth: i32 = @intFromFloat(std.math.floor(std.math.log2(toFloor)) + 1.0);
    const byteAmount: usize = @intCast(try std.math.divCeil(i32, opcodeBitwidth, byteBitwidth));

    const pc = core.registers[0];

    var opcode: usize = 0;
    for (0..byteAmount) |_| {
        opcode <<= byteBitwidth;
        opcode |= core.memoryController.fetchByte(pc.Addr.value); 
        pc.Addr.value += 1;
    }

    const instr = instructions.Instructions[opcode];
    
    const instruction: *Instruction(WordType, AddrType) = try allocator.create(Instruction(WordType, AddrType));
    instruction.name = instr.name;
    instruction.arguments = try allocator.alloc(InstructionArgument(WordType, AddrType), instr.arguments.len);
    
    for (instr.arguments, 0..) |argument, i| {
        switch (argument) {
            .PORT => {
                const res = try core.memoryController.fetchWord(pc.Addr.value);
                pc.Addr.value += @intCast(res.bytes);
                instruction.arguments[i] 
                    = InstructionArgument(WordType, AddrType){ .PORT = .{
                            .value = res.result
                        }
                    };
            },
            .WORD => {
                const res = try core.memoryController.fetchWord(pc.Addr.value);
                pc.Addr.value += @intCast(res.bytes);
                instruction.arguments[i] = InstructionArgument(WordType, AddrType) {.WORD = .{
                    .value = res.result
                }
    };
            },
            .REGISTER => {
                const res = try core.memoryController.fetchWord(pc.Addr.value);
                pc.Addr.value += @intCast(res.bytes);
                instruction.arguments[i] = InstructionArgument(WordType, AddrType) {.REGISTER = .{
                    .value = res.result
                }};
            },
            .ADDRESS => {
                const res = try core.memoryController.fetchAddr(pc.Addr.value);
                pc.Addr.value += @intCast(res.bytes);
                instruction.arguments[i] = InstructionArgument(WordType, AddrType){.ADDRESS = .{ 
                    .value = res.result 
                }};
            }
        }
    }

    return instruction;
}
