import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor() { }

  api_url: string = "http://localhost:8000/api/";

  makeRequest(method, slug, params = undefined, payload = undefined): string {
    var xhr = new XMLHttpRequest();

    var request_uri = this.api_url + slug;
    if (params) { request_uri += "?" + params; }

    xhr.open(method, request_uri, false);
    xhr.send(payload);
    return xhr.responseText;
  }

  getTop(): JSON {
    return JSON.parse( this.makeRequest('GET', 'get_top/') );
  }

  getLastArticles(): JSON {
    return JSON.parse( this.makeRequest('GET', 'get_last_articles/') );
  }

  getLastPosts(): JSON {
    return JSON.parse( this.makeRequest('GET', 'get_last_posts/') );
  }

  getArticle(slug): JSON {
    let params = 'slug=' + slug
    return JSON.parse( this.makeRequest('GET', 'get_article/', params) );
  }

  getPost(slug): JSON {
    let params = 'slug=' + slug
    return JSON.parse( this.makeRequest('GET', 'get_post/', params) );
  }

  registration(login, email, name, password, base64Image): JSON {
    let params = 'login=' + login + '&email=' + email + '&name=' + name + '&password=' + Md5.hashStr(JSON.stringify(password))
    return JSON.parse( this.makeRequest('POST', 'reg/', params, base64Image) );
  }

  autharization(login, password): JSON {
    let params = "login=" + login + '&password=' + Md5.hashStr(JSON.stringify(password));
    return JSON.parse( this.makeRequest('POST', 'auth/', params) );
  }

  getProfileInfo(session_token): JSON {
    let params = 'token=' + session_token;
    return JSON.parse( this.makeRequest('GET', 'get_profile/', params) );
  }

  getProfilePicture(session_token): JSON {
    let params = 'token=' + session_token;
    return JSON.parse( this.makeRequest('GET', 'get_profile_picture/', params) );
  }

  rateUp(session_token, type, slug) {
    let params = 'token=' + session_token + '&type=' + type + '&slug=' + slug;
    return JSON.parse( this.makeRequest('POST', 'rate_up/', params) );
  }

  rateDown(session_token, type, slug) {
    let params = 'token=' + session_token + '&type=' + type + '&slug=' + slug;
    return JSON.parse( this.makeRequest('POST', 'rate_down/', params) );
  }

  exit(session_token): JSON {
    let params = 'token=' + session_token;
    return JSON.parse( this.makeRequest('POST', 'exit/', params) );
  }
}
