package com.savms.demo.ai;

public class DetourDetectorDemo {
    public static void main(String[] args) {
        final CoordLL src = new CoordLL(-35.24124315559853, 149.07038590729474); // Weeden Lodge from Google Map
        final CoordLL dst = new CoordLL(-35.277438530974194, 149.11994596791513); // ANU Student Central from Google Map
        final CoordLL currentNotDetouring = new CoordLL(-35.272457, 149.117696); // somewhere on Barry Drive
        final CoordLL currentDetouring = new CoordLL(-35.259377, 149.119122); // somewhere on MacArthur Ave
        DetourDetectCommand cmdNotDetouring = DetourDetectCommand.builder()
                .src(src)
                .dst(dst)
                .current(currentNotDetouring)
                .build();
        DetourDetectCommand cmdDetouring = DetourDetectCommand.builder()
                .src(src)
                .dst(dst)
                .current(currentDetouring)
                .build();

        DetourDetector detourDetector = new SimpleDetourDetector();

        String resNotDetour = detourDetector.execute(cmdNotDetouring);
        String resDetour = detourDetector.execute(cmdDetouring);

        System.out.println(resNotDetour);
        System.out.println("===============");
        System.out.println(resDetour);
    }
}
