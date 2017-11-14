import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { DynamoDB } from '../../providers/aws-dynamodb';

declare var AWS: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  prsn1location: {
    lat: number,
    lng: number
  }
  prsn2location: {
    lat: number,
    lng: number
  }

  accessKeyId = 'AKIAJV3MNVAC56MGLSIA';
  secretAccessKey = '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';
  credentials = new AWS.Credentials({
    accessKeyId: this.accessKeyId, secretAccessKey: this.secretAccessKey, sessionToken: null
  });
  tableName = 'USERS_LOCATION';
  

  constructor(private geolocation: Geolocation, public navCtrl: NavController) {

    AWS.config.credentials = this.credentials
    AWS.config.region = 'ap-south-1';


    this.createTable();
    console.log("Constructor Initialized");
    // setInterval(() => {
    //   console.log("Set Interval Called");
    //   this.getGeoLocation('SetInterval');
    // }, 6000);
  }

  createTable() {

    
    var params = {
      AttributeDefinitions: [
        {
          AttributeName: 'USER_NAME',
          AttributeType: 'S'
        },
        {
          AttributeName: 'USER_DETAILS',
          AttributeType: 'S'
        }
      ],
      KeySchema: [
        {
          AttributeName: 'USER_NAME',
          KeyType: 'HASH'
        },
        {
          AttributeName: 'USER_DETAILS',
          KeyType: 'RANGE'
        }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1
      },
      TableName: this.tableName,
      StreamSpecification: {
        StreamEnabled: false
      }
    }


    let ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

    // Call DynamoDB to create the table
    ddb.createTable(params, function (err, data) {
      if (err) {
        let resInUseException: any = 'ResourceInUseException';
        if ((err.statusCode = 400) && (err.code == resInUseException)) {
          console.log("Table already Exists!!");
        }
        else {
          console.log("Error in creating Table", err);
        }
      } else {
        console.log("Success", data);
        try {
          AWS.DynamoDB.waitUntilActive(DynamoDB, this.tableName);
        } catch (err) {
          // table didn't become active
          console.log("Table didn't become active");
        }
        finally {
          console.log("Finally executed");
        }
      }
    });

  }

  cloneAsObject(obj) {
    if (obj === null || !(obj instanceof Object)) {
        return obj;
    }
    var s_position = (obj instanceof Array) ? [] : {};
    // ReSharper disable once MissingHasOwnPropertyInForeach
    for (var key in obj) {
      s_position[key] = this.cloneAsObject(obj[key]);
    }
    return s_position;
}

  getGeoLocation(input, flag = false) {
    //let input = input;
    console.log("User :" + input + "Button Flag :" + flag);
    return this.geolocation.getCurrentPosition().then((resp) => {
      console.log("Positions : " + JSON.stringify(this.cloneAsObject(resp)));
      if(flag) {
      this.prsn1location = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      }
    }
    else{
      this.prsn2location = {
        lat: resp.coords.latitude,
        lng: resp.coords.longitude
      }
    }
      // Fetch successful hence write to DynamoDB
      var params = {
        TableName: this.tableName,
        Item: {
          'USER_NAME' : {S: input},
          'USER_DETAILS' : {S: JSON.stringify(this.cloneAsObject(resp))}
        }
      };
      
      // Call DynamoDB to add the item to the table
      var ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });
      ddb.putItem(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      });

    })
  }
}
