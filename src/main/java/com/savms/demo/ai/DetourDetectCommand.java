package com.savms.demo.ai;

import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Builder
@Getter
public class DetourDetectCommand {
    private CoordLL src;
    private CoordLL dst;
    private CoordLL current;
}
