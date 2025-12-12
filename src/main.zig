const std = @import("std");
const emulator = @import("emulator/state.zig");
const allocator = std.heap.page_allocator;
const f = @import("./emulator/fetch.zig");
const fetch = f.fetch;

pub fn main() !void {
    const em = try allocator.create(emulator.Emulator(u8, u16, u32));
    defer allocator.destroy(em);
    try em.init(1600, 4, 2, 2);
    defer em.deinit();

    em.memory[1] = 1;

    const instruction = try fetch(u8, u16, u32, &em.cores[0]);

    std.debug.print("{}\n", .{em});
    std.debug.print("{}\n", .{instruction});
}
