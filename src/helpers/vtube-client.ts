import { VTubeClient } from "@dogonis/vtube-client";

import { env } from "@/env";

export const vtube = new VTubeClient(env.MAIN_API);
