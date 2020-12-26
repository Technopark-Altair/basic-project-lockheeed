import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor() { }

  api_url: string = "http://46.39.252.82:8000/api/";

  makeRequest(method, slug, params = undefined, payload = undefined) {
    var xhr = new XMLHttpRequest();

    var request_uri = this.api_url + slug;
    if (params) { request_uri += "?" + params; }

    xhr.open(method, request_uri, false);
    xhr.send(payload);
    return xhr.responseText;
  }

  getTop() {
    return this.makeRequest('GET', 'get_top/');
  }

  getLastArticles() {
    return this.makeRequest('GET', 'get_last_articles/');
  }

  getLastPosts() {
    return this.makeRequest('GET', 'get_last_posts/');
  }

  getArticle(slug) {
    let params = 'slug=' + slug
    return this.makeRequest('GET', 'get_article/', params);
  }

  getPost(slug) {
    let params = 'slug=' + slug
    return this.makeRequest('GET', 'get_post/', params);
  }

  registration(login, email, name, password, base64Image) {
    let params = 'login=' + login + '&email=' + email + '&name=' + name + '&password=' + Md5.hashStr(JSON.stringify(password))
    return this.makeRequest('POST', 'reg/', params, base64Image);
  }

  autharization(login, password) {
    let params = "login=" + login + '&password=' + Md5.hashStr(JSON.stringify(password));
    return this.makeRequest('POST', 'auth/', params);
  }

  getProfileInfo(session_token) {
    let params = 'token=' + session_token;
    return this.makeRequest('GET', 'get_profile/', params);
  }

  getProfilePicture(session_token) {
    let params = 'token=' + session_token;
    return this.makeRequest('GET', 'get_profile_picture/', params);
  }

  exit(session_token) {
    let params = 'token=' + session_token;
    return this.makeRequest('POST', 'exit/', params);
  }
}
