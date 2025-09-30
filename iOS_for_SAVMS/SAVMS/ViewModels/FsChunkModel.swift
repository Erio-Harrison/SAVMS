//
//  FsChunks.swift
//  SAVMS
//
//  Created by Renken G on 19/8/2025.
//

import Foundation

struct FileChunk: Identifiable, Codable {
    var id: String           // from _id.$oid
    var fileId: String       // from files_id.$oid
    var n: Int               // chunk sequence
    var base64Data: String   // from data.$binary.base64
    var subType: String      // from data.$binary.subType
}
