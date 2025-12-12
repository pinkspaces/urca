const std = @import("std");
const allocator = std.heap.page_allocator;

pub const RegisterType = enum {
    Addr, Word
};
pub fn AddressRegister(comptime AddrType: type) type {
    return struct { value: AddrType };
}

pub fn WordRegister(comptime WordType: type) type {
    return struct { value: WordType };
}
pub fn Register(comptime WordType: type, comptime AddrType: type)type {
    return union(RegisterType) {
        Addr: *AddressRegister(AddrType), Word: *WordRegister(WordType)
    };
}

pub fn FetchResult(comptime ValueType: type) type {
    return struct {
        result: ValueType,
        bytes: usize
    };
}

pub fn MemoryController(comptime ByteType: type, comptime WordType: type, comptime AddrType: type) type {
    return struct { 
        emulator: *Emulator(ByteType, WordType, AddrType),
        pub fn fetchByte(self: *MemoryController(ByteType, WordType, AddrType), index: usize) ByteType {
            return self.emulator.memory[index];
        }
        pub fn fetchWord(self: *MemoryController(ByteType, WordType, AddrType), index: usize) !FetchResult(WordType) {
            const wordBitwidth = @bitSizeOf(WordType);
            const byteBitwidth = @bitSizeOf(ByteType);
            const bitwidthRatio: usize = @intCast(try std.math.divCeil(i32, wordBitwidth, byteBitwidth));
            var result: WordType = 0;
            for (0..bitwidthRatio) |i| {
                result <<= byteBitwidth;
                result |= self.emulator.memory[index + i];
            }
            return FetchResult(WordType){
                .result = result,
                .bytes = bitwidthRatio
            };
        }
        pub fn fetchAddr(self: *MemoryController(ByteType, WordType, AddrType), index: usize) !FetchResult(AddrType) {
            const addrBitwidth = @bitSizeOf(AddrType);
            const byteBitwidth = @bitSizeOf(ByteType);
            const bitwidthRatio: usize = @intCast(try std.math.divCeil(i32, addrBitwidth, byteBitwidth));
            var result: AddrType = 0;
            for (0..bitwidthRatio) |i| {
                result <<= byteBitwidth;
                result |= self.emulator.memory[index + i];
            }
            return FetchResult(AddrType){
                .result = result,
                .bytes = bitwidthRatio
            };
        }
    };
}


pub fn Core(comptime ByteType: type, comptime WordType: type, comptime AddrType: type) type {
    return struct {
        halted: bool,
        registers: []Register(WordType, AddrType),
        memoryController: *MemoryController(ByteType, WordType, AddrType),
        pub fn init(self: *Core(ByteType, WordType, AddrType), emulator: *Emulator(ByteType, WordType, AddrType), addressRegisters: usize, wordRegisters: usize) !void {
            self.registers = try allocator.alloc(Register(WordType, AddrType), addressRegisters + wordRegisters + 2);
            self.memoryController = try allocator.create(MemoryController(ByteType, WordType, AddrType));
            self.memoryController.emulator = emulator;
            var i: usize = 0;
            while (i < addressRegisters + 2) : (i += 1) {
                self.registers[i] = Register(WordType, AddrType){
                    .Addr = try allocator.create(AddressRegister(AddrType))
                }; 
                const v: Register(WordType, AddrType) = self.registers[i];
                v.Addr.value = 0;
            }
            while (i < addressRegisters + wordRegisters + 2) : (i += 1) {
                self.registers[i] = Register(WordType, AddrType){
                    .Word = try allocator.create(WordRegister(WordType))
                };
                const v: Register(WordType, AddrType) = self.registers[i];
                v.Word.value = 0;
            }
            self.halted = false;
        }
        pub fn deinit(self: *Core(ByteType, WordType, AddrType)) void {
            for (self.registers) |register| {
                switch (register) {
                    .Addr => |*addr| allocator.destroy(addr.*),
                    .Word => |*word| allocator.destroy(word.*)
                }
            }
            allocator.destroy(self.memoryController);
            allocator.free(self.registers);
        }
    }; 
}

pub fn Emulator(comptime ByteType: type, comptime WordType: type, comptime AddrType: type) type {
    return struct {
        memory: []ByteType,
        cores: []Core(ByteType, WordType, AddrType),
        pub fn init(self: *Emulator(ByteType, WordType, AddrType), memorySize: usize, cores: usize, addressRegisters: usize, wordRegisters: usize) !void {
            self.memory = try allocator.alloc(ByteType, memorySize);
            for (self.memory) |*v| {
                v.* = 0;
            }
            self.cores = try allocator.alloc(Core(ByteType, WordType, AddrType), cores);
            for (self.cores, 0..) |_, index| {
                try self.cores[index].init(self, addressRegisters, wordRegisters);
            }
        }
        pub fn deinit(self: *Emulator(ByteType, WordType, AddrType)) void {
            for (self.cores) |*core| {
                core.deinit();
            }
            allocator.free(self.cores);
            allocator.free(self.memory);
        }
    }; 
}
