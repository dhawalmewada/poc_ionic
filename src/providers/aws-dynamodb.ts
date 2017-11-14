/// <reference types="aws-sdk" />

import { Injectable } from '@angular/core';

declare var AWS: any;
AWS.config.region = 'ap-south-1';

@Injectable()
export class DynamoDB {

    private documentClient: any;

    constructor() {
        this.documentClient = new AWS.DynamoDB.DocumentClient();

        // Create the DynamoDB service object
        var ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

        // var params = {
        //     AttributeDefinitions: [
        //         {
        //             AttributeName: 'CUSTOMER_ID',
        //             AttributeType: 'N'
        //         },
        //         {
        //             AttributeName: 'CUSTOMER_NAME',
        //             AttributeType: 'S'
        //         }
        //     ],
        //     KeySchema: [
        //         {
        //             AttributeName: 'CUSTOMER_ID',
        //             KeyType: 'HASH'
        //         },
        //         AttributeName: 'CUSTOMER_NAME',
        //         AttributeType: 'RANGE'
        //     ],
        //     ProvisionedThroughput: {
        //         ReadCapacityUnits: 1,
        //         WriteCapacityUnits: 1
        //     },
        //     TableName: 'CUSTOMER_LIST',
        //     StreamSpecification: {
        //         StreamEnabled: false
        //     }
        // };
        var params = {
                AttributeDefinitions: [
                    {
                        AttributeName: 'CUSTOMER_ID',
                        AttributeType: 'N'
                    },
                    {
                        AttributeName: 'CUSTOMER_NAME',
                        AttributeType: 'S'
                    }
                ]
            }

        // Call DynamoDB to create the table
        ddb.createTable(params, function (err, data) {
            if (err) {
                console.log("Error", err);
            } else {
                console.log("Success", data.Table.KeySchema);
            }
        });

    }

    getDocumentClient() {
        return this.documentClient;
    }

    writeDocument() {

    }
}
