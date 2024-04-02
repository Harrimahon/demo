import {readFile} from "fs/promises";
import crypto from "crypto";

interface ScannerConfig {
}

interface ScanResult {
    isInfected: boolean
    infections: string[]
    filename: string
    sha256: string
}

class Scanner {
    config: ScannerConfig


    constructor(config: ScannerConfig) {
        this.config = config

    }

    async scanFile(pathname: string, originalFilename: string): Promise<ScanResult> {
        console.log("scanning file: " + originalFilename)
        const buf = await readFile(pathname)
        if (originalFilename.endsWith('.pdf')) {
            return this.#getInfectedResult(originalFilename, buf)
        }
        return this.#getResult(originalFilename, buf)
    }

    #getResult(filename: string, b: Buffer): ScanResult {
        const sha256 = this.#hash(b)
        return {
            isInfected: false,
            filename,
            sha256: sha256,
            infections: []
        }
    }

    #getInfectedResult(filename: string, b: Buffer): ScanResult {
        const sha256 = this.#hash(b)
        return {
            isInfected: true,
            filename,
            sha256: sha256,
            infections: ["stuxnet"]
        }
    }

    #hash(b: Buffer): string {
        return crypto
            .createHash("sha256")
            .update(b)
            .digest("hex")
    }
}

export default new Scanner({})