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

  search(query): JSON {
    let params = 'query=' + query
    return JSON.parse( this.makeRequest('GET', 'search/', params) );
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

  getArticle(session_token = "", slug): JSON {
    let params = 'token=' + session_token + '&slug=' + slug
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

  sendArticle(session_token, articleTitle, articleContent): JSON {
    let params = 'token=' + session_token + '&title=' + articleTitle;
    return JSON.parse( this.makeRequest('POST', 'publicate_article/', params, articleContent) );
  }

  rate(session_token, type, slug, mark) {
    let params = 'token=' + session_token + '&type=' + type + '&slug=' + slug + '&mark=' + mark;
    return JSON.parse( this.makeRequest('POST', 'rate/', params) );
  }

  sendComment(session_token, type, slug, comment) {
    let params = 'token=' + session_token + '&type=' + type + '&slug=' + slug + '&comment=' + comment;
    return JSON.parse( this.makeRequest('POST', 'send_comment/', params) );
  }

  updateAvatar(session_token, base64Image): JSON {
    let params = 'token=' + session_token;
    return JSON.parse( this.makeRequest('POST', 'update_avatar/', params, base64Image) );
  }

  updatePassword(session_token, current_password, new_password): JSON {
    let params = 'token=' + session_token + '&current=' + Md5.hashStr(JSON.stringify(current_password)) + '&new=' + Md5.hashStr(JSON.stringify(new_password));
    return JSON.parse( this.makeRequest('POST', 'update_password/', params) );
  }

  exit(session_token): JSON {
    let params = 'token=' + session_token;
    return JSON.parse( this.makeRequest('POST', 'exit/', params) );
  }
}
