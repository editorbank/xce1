
var oshell = new ActiveXObject("WScript.Shell");
var dom = new ActiveXObject("Msxml2.DOMDocument");
dom.async = false;
dom.setProperty("SelectionLanguage", "XPath");

var Quote="\'";
var ViewAttr=false;
var XPathMode=true;
var isDebug=false;

var CommandStream=null;
var CommandStream_Arg_i=0;
var getArg_i=0;
var getArg_File_Line=0;

var XML_inFile="";
var NODE="";
var cnodeo=null;
var isNumNodes=false;
var ATTRIBUTE="";
var attrValue="";
var text="";
var XML_outFile="";
var XML_isLoad=false;
var VARIABLE="";
var _temp;
var fileArg=null;
var DAF="";
var ENVIRONMENT="";

function node_to_XPath(node){
  if(null==(node)) return "";
  var str="";
  if(ViewAttr)for(var a=0;a<node.attributes.length;a++){
    if((!DAF)||(0<=(","+DAF+",").indexOf((","+node.attributes.item(a).name+",")))){
      if(""!=str) str+=(XPathMode?" and ":"");
      str+=(XPathMode?"@":" ")+node.attributes.item(a).name+"="+Quote+node.attributes.item(a).value+Quote;
    }
  }
  if(""!=str) str=(XPathMode?"[":"")+str+(XPathMode?"]":"");
  str=(XPathMode?"/":"<")+node.nodeName+str+(XPathMode?"":">");
  return str;
};
function node_get_text(node){
  for(var i=0;i<node.childNodes.length;i++)
    if(node.childNodes.item(i).nodeType==3) 
      return node.childNodes.item(i).text;
  return null;
}

function node_path(node){
  if(null==node) return "";
  path="";
  var tx=node_get_text(node);
  if(tx!=null) path=(XPathMode?"[.="+Quote:"")+( tx )+(XPathMode?Quote+"]":"</"/*+node.nodeName+">"*/);
  for(;(null!=node)&&(""!=node.baseName);node=node.parentNode,path=""+path){
    path=node_to_XPath(node)+path;
  }
  return path;
};


function dd(o,s){
  var a=s.split(",");
  for(var i=0;i<a.length;i++)
    debug(o+a[i]+":"+eval(a[i]));
}
function debug(text){
  if(isDebug) WScript.StdOut.writeLine(text);
};
function view(text){
  WScript.StdOut.writeLine(text);
};
function error(text){
  debug("!!!ERROR:"+text);
  dd("  ","Quote,ViewAttr,XPathMode,isDebug,XML_inFile,NODE,cnodeo,isNumNodes,ATTRIBUTE,attrValue,text,XML_outFile,XML_isLoad,VARIABLE,_temp,cmd,ENVIRONMENT");
  debug("  cnodeo:"+(cnodeo?node_path(cnodeo):null));
  WScript.Quit(1);
};

function getArg(){
  //debug("getArg...");
  if(null!=CommandStream){
    if(fileArg){
     var ret=fileArg;
     if("$"==ret)ret=VARIABLE;
     ret=oshell.ExpandEnvironmentStrings(ret);

     debug("getArgFile.Line#"+getArg_File_Line+"=("+ret+")");
     fileArg=null;
     return ret;
    }
    error("getArgFile.Line#"+getArg_File_Line+". Need argument!");
    CommandStream=null;
  };
  if(getArg_i>=WScript.Arguments.length) return null;
  var newArg=WScript.Arguments(getArg_i);
  debug("getArgCommandLine."+getArg_i+"=("+newArg+")");
  getArg_i++;
  return newArg;
}

function getCmd(){
  //debug("getCmd...");
  if(null!=CommandStream){
    fileArg=null;
    while(!CommandStream.AtEndOfStream){
      var line=CommandStream.ReadLine();getArg_File_Line++;
      line = line.replace(/(^\s+)|(\s+$)|(\s*[;].*$)|(\s*[-][-].*$)/g,""); //no use (\s*[/][/].*$) xpath uncompaible
      if(""==line) continue;
      var cmd=null;
      var si=line.indexOf(" ");
      if(si>0){
        cmd=line.substr(0,si);
        line=line.substr(si).replace(/^\s*/,"");
        if(("\""==line.substr(0,1)&&"\""==line.substr(line.length-1,1)) || ("\'"==line.substr(0,1)&&"\'"==line.substr(line.length-1,1))){
          line=line.substr(1,line.length-2);
        }
        if(line) fileArg=line;
      }else cmd=line;

      debug("getCmdFile.Line#"+getArg_File_Line+"=("+cmd+")("+fileArg+")");
      return cmd;
    };
    CommandStream=null;
  };
  if(getArg_i>=WScript.Arguments.length) return null;
  var newArg=WScript.Arguments(getArg_i);
  debug("getCmdCommandLine."+getArg_i+"=("+newArg+")");
  getArg_i++;
  return newArg;
}



debug("Start...");
for(var cmd=getCmd(); cmd!=null; cmd=getCmd()){
  cmd=cmd.toUpperCase();
  debug("command:"+cmd+"...");
  switch(cmd){

    case "FL":
    case "-FL":
      XML_inFile=getArg();
      debug("-FILE_LOAD:"+XML_inFile);
      XML_isLoad = dom.load(XML_inFile);
      debug("XML_isLoad:"+XML_isLoad);
    case "-FL2":
      
      if(!XML_isLoad){
        if(!XML_inFile) XML_inFile=getArg();
        debug("-FILE_LOAD2:"+XML_inFile);
        var f = (new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile(XML_inFile,1,false);
        var str = f.ReadAll();
        f.Close();
        XML_isLoad = dom.loadXML(str);
        debug("  load2:"+XML_isLoad);
      }
      
      dd("  ","dom.definition,dom.doctype,dom.dataType,!!dom.firstChild,!!dom.documentElement,!!dom.implementation,!!dom.lastChild,!!dom.nextSibling,dom.nodeName,dom.nodeType,dom.nodeTypedValue,dom.nodeTypeString,dom.nodeValue,dom.prefix,dom.preserveWhiteSpace,dom.readyState,dom.resolveExternals,dom.specified,dom.url,dom.validateOnParse,dom.namespaceURI");

      debug("  namespaces.length:"+dom.namespaces.length);
      for(var i=0; i<dom.namespaces.length;i++){
        debug("    namespaceURI("+i+"):"+dom.namespaces.namespaceURI(i));
      }
      dd("  ","dom.parsed,dom.parseError");
      var err=dom.parseError;
      if(err){
       dd("    ","err.errorCode,err.filepos,err.line,err.linepos,err.reason,err.url");
      }
    break;

    case "SLN":
    case "-N:":
      NODE=getArg();
      if("$"==NODE.toUpperCase())NODE=VARIABLE;
      debug("-NODE:"+NODE);
      cnodeo=dom.selectSingleNode(NODE);
      debug("cnodeo=("+ (cnodeo) +")");
      debug("N=("+ node_path(cnodeo) +")");
    break;

    case "IF":
    case "-IF":
      _temp=getArg().toUpperCase();
      if(!(
        ( "N"==_temp && null!=cnodeo)
        ||
        ("!N"==_temp && null==cnodeo)
      )){
        while(true){
          _temp=getCmd();
          if ( null == _temp ) error("No closed IF!");
          if ( "-FI" == _temp.toUpperCase() || "FI" == _temp.toUpperCase() ) break;
          debug("  skeep: \""+_temp+"\"");
        }
      }
    break;

    case "FI":
    case "-FI": break;

    case "EXIT":
    case "-EXIT": WScript.Quit(0); break;


    case "-DN":
      NODE=getArg();
      debug("NODE=(" +NODE +")");
      var nodelist = dom/*.documentElement*/.selectNodes(NODE);
      if(isNumNodes) debug("Found node(s):" + nodelist.length);
      for(var i=0;i<nodelist.length;i++){
        cnodeo=nodelist.item(i);
        view( (isNumNodes?(""+(i+1)+"#"):"") + node_path(cnodeo));
      }
    break;

    case "NAC":
    case "-NAC":
      if( !cnodeo ) error("Node not selected!");
      _temp=getArg();
      debug("-NODE_APPEND_CHILD:" + _temp);
      var newNode=dom.createElement(_temp);
      cnodeo=cnodeo.appendChild(newNode);
      //cnodeo=newNode;
      debug("  newNode:" + node_path(cnodeo));
    break;

    case "NIB":
    case "-NIB":
      _temp=getArg();
      debug("-NODE_INSERT_BEFORE:" + _temp);
      var newNode=dom.createElement(_temp);
      cnodeo.parentNode.insertBefore(newNode,cnodeo);
      cnodeo=newNode;
      debug("  newNode:" + node_path(cnodeo));
    break;

    case "NDEL":
    case "-NDEL":
      if( !cnodeo ) error("Node not selected!");
      debug("-NODE_REMOVE:" + node_path(cnodeo));
      var newNode=cnodeo.parentNode;
      cnodeo = cnodeo.parentNode.removeChild(cnodeo);
      cnodeo = newNode;
      debug("  currentNode:" + node_path(cnodeo));
    break;

    case "SLA":
    case "-A:":
      if(null==( ATTRIBUTE=getArg() )) error("Need argument!");
      debug("ATTRIBUTE=(" + ATTRIBUTE+")");
    break;

    case "ADEL":
    case "-ADEL":
      if( !cnodeo ) error("Node not selected!");
      if( !ATTRIBUTE ) error("Attribute not selected!");
      debug("cnodeo=("+ node_path(cnodeo) +")");
      debug("ATTRIBUTE=("+ ATTRIBUTE +")");
      cnodeo.removeAttribute(ATTRIBUTE);
      cnodeo=ATTRIBUTE=null;
    break;

    case "LDA":
    case "-A=":
      if( !cnodeo ) error("Node not selected!");
      if( !ATTRIBUTE ) error("Attribute not selected!");
      if(null==( _temp=getArg() )) error("Need argument!");
      debug("cnodeo=("+ node_path(cnodeo) +")");
      debug("ATTRIBUTE=("+ ATTRIBUTE +")");
      cnodeo.setAttribute(ATTRIBUTE, _temp);
      debug(""+ node_path(cnodeo) +"@"+ ATTRIBUTE +"=("+_temp+")");
    break;

    case "LDT":
    case "-T=":
      if( !cnodeo ) error("Node not selected!");
      if(null==( _temp=getArg() )) error("Need argument!");
      cnodeo.text=_temp;
      debug(""+ node_path(cnodeo) +".=("+_temp+")");
    break;

    case "LD$":
    case "-$=":
      VARIABLE=getArg();
      debug("VARIABLE=("+ VARIABLE +")");
    break;

    case "SLE":
    case "-E:":
      ENVIRONMENT=getArg();
      debug("ENVIRONMENT=("+ ENVIRONMENT +")");
    break;

    case "LDE":
    case "-E=":
      _temp=getArg();
      if(!ENVIRONMENT) error("No defined name of ENVIRONMENT variable.");
      oshell.Environment("Process")(ENVIRONMENT)=(_temp);
      debug("%"+ ENVIRONMENT +"%=("+ _temp +")");
    break;

    case "LET":
    case "-==":
      if( !cnodeo ) error("Node not selected!");
      if(null==( _temp=getArg() )) error("Need argument!");
      _temp=_temp.toUpperCase();
      //ENVIRONMENT
      if("E"+"="+"$"==_temp){
        if(!ENVIRONMENT) error("No defined name of ENVIRONMENT variable.");
        oshell.Environment("Process")(ENVIRONMENT)=(VARIABLE);
        debug("%"+ ENVIRONMENT +"%=("+ VARIABLE +")");
        break;
      }
      if("$"+"="+"E"==_temp){
        if(!ENVIRONMENT) error("No defined name of ENVIRONMENT variable.");
        VARIABLE=oshell.Environment("Process")(ENVIRONMENT);
        debug("%"+ ENVIRONMENT +"%=("+ VARIABLE +")");
        break;
      }
      //TEXT
      if("T"+"="+"$"==_temp){
        if( !cnodeo ) error("Node not selected!");
        cnodeo.text=VARIABLE;
        debug(".=("+ VARIABLE +")");
        break;
      }
      if("$"+"="+"T"==_temp){
        if( !cnodeo ) error("Node not selected!");
        VARIABLE=cnodeo.text;
        debug("$=("+ VARIABLE +")");
        break;
      }
      //ATTRIBUTE
      if("A"+"="+"$"==_temp){
        if( !cnodeo ) error("Node not selected!");
        cnodeo.setAttribute(ATTRIBUTE, VARIABLE);
        debug("A=("+ VARIABLE +")");
        break;
      }
      if("$"+"="+"A"==_temp){
        if( !cnodeo ) error("Node not selected!");
        VARIABLE=cnodeo.getAttribute(ATTRIBUTE);
        debug("$=("+ VARIABLE +")");
        break;
      }
      error("Undefined arguments or operation ("+cmd+" "+_temp+")!");
    break;

    case "FS":
    case "-FS":
      if( !XML_inFile ) error("File not loaded!");
      debug("-FILE_SAVE:" + (XML_inFile));
      dom.save(XML_inFile);
    break;

    case "FSA":
    case "-FSA":
      if(null==( XML_outFile=getArg() )) error("Need argument!");
      debug("-FILE_SAVE_AS:" + (XML_outFile));
      dom.save(XML_outFile);
    break;

    case "-D+":    isDebug=true;     break;
    case "-D-":    isDebug=false;    break;
    case "-DNN+":  isNumNodes=true;    break;
    case "-DNN-":  isNumNodes=false;   break;
    case "-DQ0":   Quote="";      break;
    case "-DQ1":   Quote="\'";    break;
    case "-DQ2":   Quote="\"";    break;


    case "-DXML":
      if( !cnodeo ) error("Node not selected!");
      view("XML=("+ cnodeo.xml +")");
    break;

    case "-DA+": ViewAttr=true;   break;
    case "-DA-": ViewAttr=false;  break;

    case "-DOF+": XPathMode=true; break;
    case "-DOF-": XPathMode=false; break;

    case "-FC":
      if(null==( cmdfilename=getArg() )) error("Need argument!");
      debug("  cmdfilename:"+cmdfilename);
      
      if("CON"==cmdfilename.toUpperCase()){
        CommandStream=WScript.StdIn;
        if(null==CommandStream) error("Command file \""+cmdfilename+"\" no open!");
      }else{
        CommandStream=(new ActiveXObject("Scripting.FileSystemObject")).OpenTextFile(cmdfilename,1,false);
        if(null==CommandStream) error("Command file \""+cmdfilename+"\" no open!");
      }
    break;

    case "END": 
    case "-END": 
      if(null!=CommandStream && "CON"!=cmdfilename.toUpperCase()) CommandStream.Close();
      CommandStream=null;
    break;


    case "-PRESERVE_WHITE_SPACE+":    dom.preserveWhiteSpace = true;   break;
    case "-PRESERVE_WHITE_SPACE-":    dom.preserveWhiteSpace = false;  break;

    case "-NORMALIZE":
      var __xml=dom.xml.replace(/[>][\r\n\s]{0,}[<]/g,">\r\n<");
      XML_isLoad = dom.loadXML(__xml);
      dd("  ","XML_isLoad");
    break;

    case "-DAF":
      DAF=getArg();
      debug("DAF=("+ DAF +")");
    break;

    default:
      error("Undefined command \""+cmd+"\"!");
    break;
  };
};
debug("End.");
if(isDebug) WScript.Quit(100);