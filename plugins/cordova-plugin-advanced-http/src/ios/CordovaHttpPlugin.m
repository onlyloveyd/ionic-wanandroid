#import "CordovaHttpPlugin.h"
#import "CDVFile.h"
#import "BinaryResponseSerializer.h"
#import "TextResponseSerializer.h"
#import "TextRequestSerializer.h"
#import "AFHTTPSessionManager.h"
#import "SDNetworkActivityIndicator.h"

@interface CordovaHttpPlugin()

- (void)setRequestHeaders:(NSDictionary*)headers forManager:(AFHTTPSessionManager*)manager;
- (void)handleSuccess:(NSMutableDictionary*)dictionary withResponse:(NSHTTPURLResponse*)response andData:(id)data;
- (void)handleError:(NSMutableDictionary*)dictionary withResponse:(NSHTTPURLResponse*)response error:(NSError*)error;
- (NSNumber*)getStatusCode:(NSError*) error;
- (NSMutableDictionary*)copyHeaderFields:(NSDictionary*)headerFields;
- (void)setTimeout:(NSTimeInterval)timeout forManager:(AFHTTPSessionManager*)manager;
- (void)setRedirect:(bool)redirect forManager:(AFHTTPSessionManager*)manager;

@end

@implementation CordovaHttpPlugin {
    AFSecurityPolicy *securityPolicy;
}

- (void)pluginInitialize {
    securityPolicy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeNone];
}

- (void)setRequestSerializer:(NSString*)serializerName forManager:(AFHTTPSessionManager*)manager {
    if ([serializerName isEqualToString:@"json"]) {
        manager.requestSerializer = [AFJSONRequestSerializer serializer];
    } else if ([serializerName isEqualToString:@"utf8"]) {
        manager.requestSerializer = [TextRequestSerializer serializer];
    } else {
        manager.requestSerializer = [AFHTTPRequestSerializer serializer];
    }
}

- (void)setRequestHeaders:(NSDictionary*)headers forManager:(AFHTTPSessionManager*)manager {
    [headers enumerateKeysAndObjectsUsingBlock:^(id key, id obj, BOOL *stop) {
        [manager.requestSerializer setValue:obj forHTTPHeaderField:key];
    }];
}

- (void)setRedirect:(bool)followRedirect forManager:(AFHTTPSessionManager*)manager {
    [manager setTaskWillPerformHTTPRedirectionBlock:^NSURLRequest * _Nonnull(NSURLSession * _Nonnull session,
        NSURLSessionTask * _Nonnull task, NSURLResponse * _Nonnull response, NSURLRequest * _Nonnull request) {

        if (followRedirect) {
            return request;
        } else {
            return nil;
        }
    }];
}

- (void)setTimeout:(NSTimeInterval)timeout forManager:(AFHTTPSessionManager*)manager {
    [manager.requestSerializer setTimeoutInterval:timeout];
}

- (void)setResponseSerializer:(NSString*)responseType forManager:(AFHTTPSessionManager*)manager {
    if ([responseType isEqualToString: @"text"]) {
        manager.responseSerializer = [TextResponseSerializer serializer];
    } else {
        manager.responseSerializer = [BinaryResponseSerializer serializer];
    }
}


- (void)handleSuccess:(NSMutableDictionary*)dictionary withResponse:(NSHTTPURLResponse*)response andData:(id)data {
    if (response != nil) {
        [dictionary setValue:response.URL.absoluteString forKey:@"url"];
        [dictionary setObject:[NSNumber numberWithInt:(int)response.statusCode] forKey:@"status"];
        [dictionary setObject:[self copyHeaderFields:response.allHeaderFields] forKey:@"headers"];
    }

    if (data != nil) {
        [dictionary setObject:data forKey:@"data"];
    }
}

- (void)handleError:(NSMutableDictionary*)dictionary withResponse:(NSHTTPURLResponse*)response error:(NSError*)error {
    if (response != nil) {
        [dictionary setValue:response.URL.absoluteString forKey:@"url"];
        [dictionary setObject:[NSNumber numberWithInt:(int)response.statusCode] forKey:@"status"];
        [dictionary setObject:[self copyHeaderFields:response.allHeaderFields] forKey:@"headers"];
        if (error.userInfo[AFNetworkingOperationFailingURLResponseBodyErrorKey]) {
            [dictionary setObject:error.userInfo[AFNetworkingOperationFailingURLResponseBodyErrorKey] forKey:@"error"];
        }
    } else {
        [dictionary setObject:[self getStatusCode:error] forKey:@"status"];
        [dictionary setObject:[error localizedDescription] forKey:@"error"];
    }
}

- (void)handleException:(NSException*)exception withCommand:(CDVInvokedUrlCommand*)command {
  CordovaHttpPlugin* __weak weakSelf = self;

  NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
  [dictionary setValue:exception.userInfo forKey:@"error"];
  [dictionary setObject:[NSNumber numberWithInt:-1] forKey:@"status"];

  CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
  [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (NSNumber*)getStatusCode:(NSError*) error {
    switch ([error code]) {
        case -1001:
            // timeout
            return [NSNumber numberWithInt:-4];
        case -1002:
            // unsupported URL
            return [NSNumber numberWithInt:-5];
        case -1003:
            // server not found
            return [NSNumber numberWithInt:-3];
        case -1009:
            // no connection
            return [NSNumber numberWithInt:-6];
        case -1200: // secure connection failed
        case -1201: // certificate has bad date
        case -1202: // certificate untrusted
        case -1203: // certificate has unknown root
        case -1204: // certificate is not yet valid
            // configuring SSL failed
            return [NSNumber numberWithInt:-2];
        default:
            return [NSNumber numberWithInt:-1];
    }
}

- (NSMutableDictionary*)copyHeaderFields:(NSDictionary *)headerFields {
    NSMutableDictionary *headerFieldsCopy = [[NSMutableDictionary alloc] initWithCapacity:headerFields.count];
    NSString *headerKeyCopy;

    for (NSString *headerKey in headerFields.allKeys) {
        headerKeyCopy = [[headerKey mutableCopy] lowercaseString];
        [headerFieldsCopy setValue:[headerFields objectForKey:headerKey] forKey:headerKeyCopy];
    }

    return headerFieldsCopy;
}

- (void)setServerTrustMode:(CDVInvokedUrlCommand*)command {
    NSString *certMode = [command.arguments objectAtIndex:0];

    if ([certMode isEqualToString: @"default"] || [certMode isEqualToString: @"legacy"]) {
        securityPolicy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeNone];
        securityPolicy.allowInvalidCertificates = NO;
        securityPolicy.validatesDomainName = YES;
    } else if ([certMode isEqualToString: @"nocheck"]) {
        securityPolicy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeNone];
        securityPolicy.allowInvalidCertificates = YES;
        securityPolicy.validatesDomainName = NO;
    } else if ([certMode isEqualToString: @"pinned"]) {
        securityPolicy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeCertificate];
        securityPolicy.allowInvalidCertificates = NO;
        securityPolicy.validatesDomainName = YES;
    }

    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)get:(CDVInvokedUrlCommand*)command {
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.securityPolicy = securityPolicy;

    NSString *url = [command.arguments objectAtIndex:0];
    NSDictionary *headers = [command.arguments objectAtIndex:1];
    NSTimeInterval timeoutInSeconds = [[command.arguments objectAtIndex:2] doubleValue];
    bool followRedirect = [[command.arguments objectAtIndex:3] boolValue];
    NSString *responseType = [command.arguments objectAtIndex:4];

    [self setRequestSerializer: @"default" forManager: manager];
    [self setRequestHeaders: headers forManager: manager];
    [self setTimeout:timeoutInSeconds forManager:manager];
    [self setRedirect:followRedirect forManager:manager];
    [self setResponseSerializer:responseType forManager:manager];

    CordovaHttpPlugin* __weak weakSelf = self;
    [[SDNetworkActivityIndicator sharedActivityIndicator] startActivity];

    @try {
        [manager GET:url parameters:nil success:^(NSURLSessionTask *task, id responseObject) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleSuccess:dictionary withResponse:(NSHTTPURLResponse*)task.response andData:responseObject];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        } failure:^(NSURLSessionTask *task, NSError *error) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleError:dictionary withResponse:(NSHTTPURLResponse*)task.response error:error];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        }];
    }
    @catch (NSException *exception) {
        [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        [self handleException:exception withCommand:command];
    }
}

- (void)head:(CDVInvokedUrlCommand*)command {
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.securityPolicy = securityPolicy;
    manager.responseSerializer = [AFHTTPResponseSerializer serializer];

    NSString *url = [command.arguments objectAtIndex:0];
    NSDictionary *headers = [command.arguments objectAtIndex:1];
    NSTimeInterval timeoutInSeconds = [[command.arguments objectAtIndex:2] doubleValue];
    bool followRedirect = [[command.arguments objectAtIndex:3] boolValue];

    [self setRequestHeaders: headers forManager: manager];
    [self setTimeout:timeoutInSeconds forManager:manager];
    [self setRedirect:followRedirect forManager:manager];

    CordovaHttpPlugin* __weak weakSelf = self;
    [[SDNetworkActivityIndicator sharedActivityIndicator] startActivity];

    @try {
        [manager HEAD:url parameters:nil success:^(NSURLSessionTask *task) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            // no 'body' for HEAD request, omitting 'data'
            [self handleSuccess:dictionary withResponse:(NSHTTPURLResponse*)task.response andData:nil];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        } failure:^(NSURLSessionTask *task, NSError *error) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleError:dictionary withResponse:(NSHTTPURLResponse*)task.response error:error];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        }];
    }
    @catch (NSException *exception) {
        [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        [self handleException:exception withCommand:command];
    }
}

- (void)delete:(CDVInvokedUrlCommand*)command {
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.securityPolicy = securityPolicy;

    NSString *url = [command.arguments objectAtIndex:0];
    NSDictionary *headers = [command.arguments objectAtIndex:1];
    NSTimeInterval timeoutInSeconds = [[command.arguments objectAtIndex:2] doubleValue];
    bool followRedirect = [[command.arguments objectAtIndex:3] boolValue];
    NSString *responseType = [command.arguments objectAtIndex:4];

    [self setRequestSerializer: @"default" forManager: manager];
    [self setRequestHeaders: headers forManager: manager];
    [self setTimeout:timeoutInSeconds forManager:manager];
    [self setRedirect:followRedirect forManager:manager];
    [self setResponseSerializer:responseType forManager:manager];

    CordovaHttpPlugin* __weak weakSelf = self;
    [[SDNetworkActivityIndicator sharedActivityIndicator] startActivity];

    @try {
        [manager DELETE:url parameters:nil success:^(NSURLSessionTask *task, id responseObject) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleSuccess:dictionary withResponse:(NSHTTPURLResponse*)task.response andData:responseObject];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        } failure:^(NSURLSessionTask *task, NSError *error) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleError:dictionary withResponse:(NSHTTPURLResponse*)task.response error:error];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        }];
    }
    @catch (NSException *exception) {
        [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        [self handleException:exception withCommand:command];
    }
}

- (void)post:(CDVInvokedUrlCommand*)command {
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.securityPolicy = securityPolicy;

    NSString *url = [command.arguments objectAtIndex:0];
    NSDictionary *data = [command.arguments objectAtIndex:1];
    NSString *serializerName = [command.arguments objectAtIndex:2];
    NSDictionary *headers = [command.arguments objectAtIndex:3];
    NSTimeInterval timeoutInSeconds = [[command.arguments objectAtIndex:4] doubleValue];
    bool followRedirect = [[command.arguments objectAtIndex:5] boolValue];
    NSString *responseType = [command.arguments objectAtIndex:6];

    [self setRequestSerializer: serializerName forManager: manager];
    [self setRequestHeaders: headers forManager: manager];
    [self setTimeout:timeoutInSeconds forManager:manager];
    [self setRedirect:followRedirect forManager:manager];
    [self setResponseSerializer:responseType forManager:manager];

    CordovaHttpPlugin* __weak weakSelf = self;
    [[SDNetworkActivityIndicator sharedActivityIndicator] startActivity];

    @try {
        [manager POST:url parameters:data success:^(NSURLSessionTask *task, id responseObject) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleSuccess:dictionary withResponse:(NSHTTPURLResponse*)task.response andData:responseObject];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        } failure:^(NSURLSessionTask *task, NSError *error) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleError:dictionary withResponse:(NSHTTPURLResponse*)task.response error:error];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        }];
    }
    @catch (NSException *exception) {
        [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        [self handleException:exception withCommand:command];
    }
}

- (void)put:(CDVInvokedUrlCommand*)command {
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.securityPolicy = securityPolicy;

    NSString *url = [command.arguments objectAtIndex:0];
    NSDictionary *data = [command.arguments objectAtIndex:1];
    NSString *serializerName = [command.arguments objectAtIndex:2];
    NSDictionary *headers = [command.arguments objectAtIndex:3];
    NSTimeInterval timeoutInSeconds = [[command.arguments objectAtIndex:4] doubleValue];
    bool followRedirect = [[command.arguments objectAtIndex:5] boolValue];
    NSString *responseType = [command.arguments objectAtIndex:6];

    [self setRequestSerializer: serializerName forManager: manager];
    [self setRequestHeaders: headers forManager: manager];
    [self setTimeout:timeoutInSeconds forManager:manager];
    [self setRedirect:followRedirect forManager:manager];
    [self setResponseSerializer:responseType forManager:manager];

    CordovaHttpPlugin* __weak weakSelf = self;
    [[SDNetworkActivityIndicator sharedActivityIndicator] startActivity];

    @try {
        [manager PUT:url parameters:data success:^(NSURLSessionTask *task, id responseObject) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleSuccess:dictionary withResponse:(NSHTTPURLResponse*)task.response andData:responseObject];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        } failure:^(NSURLSessionTask *task, NSError *error) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleError:dictionary withResponse:(NSHTTPURLResponse*)task.response error:error];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        }];
    }
    @catch (NSException *exception) {
        [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        [self handleException:exception withCommand:command];
    }
}

- (void)patch:(CDVInvokedUrlCommand*)command {
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.securityPolicy = securityPolicy;

    NSString *url = [command.arguments objectAtIndex:0];
    NSDictionary *data = [command.arguments objectAtIndex:1];
    NSString *serializerName = [command.arguments objectAtIndex:2];
    NSDictionary *headers = [command.arguments objectAtIndex:3];
    NSTimeInterval timeoutInSeconds = [[command.arguments objectAtIndex:4] doubleValue];
    bool followRedirect = [[command.arguments objectAtIndex:5] boolValue];
    NSString *responseType = [command.arguments objectAtIndex:6];

    [self setRequestSerializer: serializerName forManager: manager];
    [self setRequestHeaders: headers forManager: manager];
    [self setTimeout:timeoutInSeconds forManager:manager];
    [self setRedirect:followRedirect forManager:manager];
    [self setResponseSerializer:responseType forManager:manager];

    CordovaHttpPlugin* __weak weakSelf = self;
    [[SDNetworkActivityIndicator sharedActivityIndicator] startActivity];

    @try {
        [manager PATCH:url parameters:data success:^(NSURLSessionTask *task, id responseObject) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleSuccess:dictionary withResponse:(NSHTTPURLResponse*)task.response andData:responseObject];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        } failure:^(NSURLSessionTask *task, NSError *error) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleError:dictionary withResponse:(NSHTTPURLResponse*)task.response error:error];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        }];
    }
    @catch (NSException *exception) {
        [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        [self handleException:exception withCommand:command];
    }
}

- (void)uploadFile:(CDVInvokedUrlCommand*)command {
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.securityPolicy = securityPolicy;

    NSString *url = [command.arguments objectAtIndex:0];
    NSDictionary *headers = [command.arguments objectAtIndex:1];
    NSString *filePath = [command.arguments objectAtIndex: 2];
    NSString *name = [command.arguments objectAtIndex: 3];
    NSTimeInterval timeoutInSeconds = [[command.arguments objectAtIndex:4] doubleValue];
    bool followRedirect = [[command.arguments objectAtIndex:5] boolValue];
    NSString *responseType = [command.arguments objectAtIndex:6];

    NSURL *fileURL = [NSURL URLWithString: filePath];

    [self setRequestHeaders: headers forManager: manager];
    [self setTimeout:timeoutInSeconds forManager:manager];
    [self setRedirect:followRedirect forManager:manager];
    [self setResponseSerializer:responseType forManager:manager];

    CordovaHttpPlugin* __weak weakSelf = self;
    [[SDNetworkActivityIndicator sharedActivityIndicator] startActivity];

    @try {
        [manager POST:url parameters:nil constructingBodyWithBlock:^(id<AFMultipartFormData> formData) {
            NSError *error;
            [formData appendPartWithFileURL:fileURL name:name error:&error];
            if (error) {
                NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
                [dictionary setObject:[NSNumber numberWithInt:500] forKey:@"status"];
                [dictionary setObject:@"Could not add file to post body." forKey:@"error"];
                CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
                [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
                return;
            }
        } progress:nil success:^(NSURLSessionTask *task, id responseObject) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleSuccess:dictionary withResponse:(NSHTTPURLResponse*)task.response andData:responseObject];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        } failure:^(NSURLSessionTask *task, NSError *error) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleError:dictionary withResponse:(NSHTTPURLResponse*)task.response error:error];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        }];
    }
    @catch (NSException *exception) {
        [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        [self handleException:exception withCommand:command];
    }
}

- (void)downloadFile:(CDVInvokedUrlCommand*)command {
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    manager.securityPolicy = securityPolicy;
    manager.responseSerializer = [AFHTTPResponseSerializer serializer];

    NSString *url = [command.arguments objectAtIndex:0];
    NSDictionary *headers = [command.arguments objectAtIndex:1];
    NSString *filePath = [command.arguments objectAtIndex: 2];
    NSTimeInterval timeoutInSeconds = [[command.arguments objectAtIndex:3] doubleValue];
    bool followRedirect = [[command.arguments objectAtIndex:4] boolValue];

    [self setRequestHeaders: headers forManager: manager];
    [self setTimeout:timeoutInSeconds forManager:manager];
    [self setRedirect:followRedirect forManager:manager];

    if ([filePath hasPrefix:@"file://"]) {
        filePath = [filePath substringFromIndex:7];
    }

    CordovaHttpPlugin* __weak weakSelf = self;
    [[SDNetworkActivityIndicator sharedActivityIndicator] startActivity];

    @try {
        [manager GET:url parameters:nil success:^(NSURLSessionTask *task, id responseObject) {
            /*
             *
             * Licensed to the Apache Software Foundation (ASF) under one
             * or more contributor license agreements.  See the NOTICE file
             * distributed with this work for additional information
             * regarding copyright ownership.  The ASF licenses this file
             * to you under the Apache License, Version 2.0 (the
             * "License"); you may not use this file except in compliance
             * with the License.  You may obtain a copy of the License at
             *
             *   http://www.apache.org/licenses/LICENSE-2.0
             *
             * Unless required by applicable law or agreed to in writing,
             * software distributed under the License is distributed on an
             * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
             * KIND, either express or implied.  See the License for the
             * specific language governing permissions and limitations
             * under the License.
             *
             * Modified by Andrew Stephan for Sync OnSet
             *
             */
            // Download response is okay; begin streaming output to file
            NSString* parentPath = [filePath stringByDeletingLastPathComponent];

            // create parent directories if needed
            NSError *error;
            if ([[NSFileManager defaultManager] createDirectoryAtPath:parentPath withIntermediateDirectories:YES attributes:nil error:&error] == NO) {
                NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
                [dictionary setObject:[NSNumber numberWithInt:500] forKey:@"status"];
                if (error) {
                    [dictionary setObject:[NSString stringWithFormat:@"Could not create path to save downloaded file: %@", [error localizedDescription]] forKey:@"error"];
                } else {
                    [dictionary setObject:@"Could not create path to save downloaded file" forKey:@"error"];
                }
                CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
                [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
                return;
            }
            NSData *data = (NSData *)responseObject;
            if (![data writeToFile:filePath atomically:YES]) {
                NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
                [dictionary setObject:[NSNumber numberWithInt:500] forKey:@"status"];
                [dictionary setObject:@"Could not write the data to the given filePath." forKey:@"error"];
                CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
                [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
                [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
                return;
            }

            id filePlugin = [self.commandDelegate getCommandInstance:@"File"];
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleSuccess:dictionary withResponse:(NSHTTPURLResponse*)task.response andData:nil];
            [dictionary setObject:[filePlugin getDirectoryEntry:filePath isDirectory:NO] forKey:@"file"];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        } failure:^(NSURLSessionTask *task, NSError *error) {
            NSMutableDictionary *dictionary = [NSMutableDictionary dictionary];
            [self handleError:dictionary withResponse:(NSHTTPURLResponse*)task.response error:error];
            [dictionary setObject:@"There was an error downloading the file" forKey:@"error"];

            CDVPluginResult *pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:dictionary];
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        }];
    }
    @catch (NSException *exception) {
        [[SDNetworkActivityIndicator sharedActivityIndicator] stopActivity];
        [self handleException:exception withCommand:command];
    }
}

@end
