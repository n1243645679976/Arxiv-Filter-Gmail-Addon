function search_OR(target, list){
  for(var idx=0 ; idx < list.length ; idx++){
    if(typeof list[idx] == 'object'){
      if(search_AND(target, list[idx])) return true;
    }
    else{
      if(target.indexOf(list[idx])>=0) return true;
    }
  }
  return false;
}
function search_AND(target, list){
  for(var idx=0 ; idx < list.length; idx++){
    if(typeof list[idx] == 'object'){
      if(!search_OR(target, list[idx])) return false;
    }
    else{
      if(target.indexOf(list[idx])<0) return false;
    }
  }
  return true;
}
function myFunction() {
  var intitles = [['timbre'], [' similarity '], [' mos '],["voice", ["conversion", "cloning"]],["text", "to", "speech"],["speaker",["identification","verification","recognition"]], ["representation"],['waveform','generation'], ['vocoder'], ['corpus', 'dataset'], ['acoustic', 'feature']];
  var searches = ['from:cs is:unread', 'from:eess is:unread'];
  var body = '';
  for (var search_ind = 0; search_ind < searches.length; search_ind++){
    body = body + 'search "' + searches[search_ind] + '"\n'
    var threads = GmailApp.search(searches[search_ind], 0, 1);
    if(threads.length == 0) continue;

    threads = threads[0];
    var messages = threads.getMessages();
    for (var i = 0; i < messages.length; i++) {
      body = body + messages[i].getDate() + '\n\n'
      
      origin_body = messages[i].getPlainBody();
      lowercase_body = origin_body.toLowerCase();

      meta_index = 0;
      meta_end_index = -2;
      paper_end_index = -2;
      while(meta_index >= 0){
        // init proper start point
        meta_index = paper_end_index + 2;
        
        // get start index of meta, meta_end, author, paper_end
        meta_index = lowercase_body.indexOf('title:', meta_index);
        meta_end_index = lowercase_body.indexOf('\\\\', meta_index + 6);
        author_index = lowercase_body.indexOf('authors:', meta_index + 6);
        paper_end_index = lowercase_body.indexOf('------------------------------------------------------------------------------', meta_index);
        if(paper_end_index == -1) paper_end_index = lowercase_body.indexOf('%%%---%%%---%%%---%%%---%%%---%%%---%%%---%%%---%%%---%%%---%%%---%%%---%%%---', meta_index);

        // if any not found, then break (not caring if author exists)
        if(meta_index <= 0 || meta_end_index <= 0 || paper_end_index <= 0 ) break;

        // get title, if author not found, then get the full metadata
        if(author_index > paper_end_index) title = lowercase_body.substr(meta_index, meta_end_index - meta_index);
        else title = lowercase_body.substr(meta_index, author_index - meta_index);

        // search intitles
        if(search_OR(title, intitles)) {
          body = body + origin_body.substr(meta_index, paper_end_index-meta_index);
          body = body + '------------------------------------------------------------------------------\n\n';
        }
      }
      messages[i].markRead();
    }
  }
  Logger.log(body);
  draft = GmailApp.createDraft("n1243456799761@gmail.com", "filtered arxiv", body);
  draft.send();
}
