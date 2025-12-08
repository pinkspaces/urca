import { CoreState } from "./state";

type Device = {
  register(core: CoreState): void;
  unregister(core: CoreState): void;
};
