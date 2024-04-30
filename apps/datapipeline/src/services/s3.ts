import {Vacature} from "../summarize.js";
import {formatDate} from "../utils.js";
import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";


export class s3Saver {
    private prefix: string;
    private client: S3Client;
    constructor() {
        this.prefix = formatDate(new Date());
        this.client = new S3Client({});
    }

    async upload(vacature: Vacature, key: string) {
        let fileName = this.prefix + "/" + key;
        await this.client.send(
            new PutObjectCommand({
                Bucket: "ggzoek-scrapy-files",
                Key: fileName,
                Body: JSON.stringify(vacature, null, 2)
            })
        );
        return fileName
    }
}