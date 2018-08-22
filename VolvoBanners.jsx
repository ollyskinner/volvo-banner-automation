// Shim to allow font list searching with TEN YEAR OLD native JS methods, FFS.
if (typeof Array.prototype.indexOf != "function") {  
    Array.prototype.indexOf = function (el) {  
        for(var i = 0; i < this.length; i++) if(el === this[i]) return i;  
        return -1;  
        }  
}

// And one for Object keys FFS
var getKeys = function(o) {
    var arr = [];
    for(key in o) { arr.push(key); }
    return arr;
}


#target photoshop;

var isMac = checkIsMac();
var isWindows = checkIsWindows();
if(!isMac && !isWindows) { throw "Your operating system is too old/weird. This software requires OSX/macOS, or Windows version 8 or 10" }

const _folderSource = $.includePath; // The current folder location

const _SLASH = (isMac) ? "/" : "\\";
const _parentFolder = _folderSource.substring(0, _folderSource.lastIndexOf(_SLASH)); // The parent folder (for storing prefs file)

const _CarModel = "Volvo XC60 Q3"

const _ScriptTitle = _CarModel+" Banner Automation";

// Default required fonts for Volvo creative. Not all may be needed for any given banner, but safer to ensure all are available.
const _reqFonts = ["VolvoBroadPro", "VolvoSansPro", "VolvoSansPro-Bold", "VolvoSansPro-Light", "VolvoSansPro-Medium"];

const _exportFormats = [{size:"300 x 250",name:"MPU"},{size:"160 x 600",name:"Wide Sky"},{size:"728 x 90",name:"Leaderboard"}];

const _manifest = [
                    {   title:  "HTML",
                        files:[ "index.html"]
                    },
                    {   title:  "GIF",
                        files:[ "backup_source.psd"]
                    }
                ];

var _userOptions = {};

const _prefsTitle = "VolvoPrefs";

var scriptResult;

try { 
    var result = main();
    
    if ( result === false ) {
        scriptResult = 'cancel';
    } else {
        scriptResult = 'ok';
    }
}

catch( e ) {
    if ( app.displayDialogs != DialogModes.NO )
    {
        alert(e, _ScriptTitle, true);
    }

    scriptResult = 'cancel';
}

scriptResult;

function main() {

	// TO DO:
	// generate procedural flow for this function:

    // DONE! Prelim - ensure this is being run on a Mac (managing file system and zip creation is much easier in OSX)
    //checkOS();

	// DONE! 1. ensure fonts are loaded
	checkFonts();
	// 1b. incorporate messaging that reports all fonts are installed (list in dialog panel?)

	// DONE! 2. ensure necessary files are in the right place
    checkFilesAndFolders(_manifest, _exportFormats.length);

	// 3. Build interface and capture user input
    getPrefs();

	getUserOptions();

    // steps 4+ are in handleApply()


}



function getPrefs() {

    // If there are no prefs, there are no prefs
    var prefs;

    // Wrapping this in a try block since ES is a dick about returning undefined values.
    try { prefs = app.getCustomOptions(_prefsTitle);
    } catch(e) {}

    // If prefs exists, retrieve
    if(typeof prefs != "undefined") {

        // For each recorded preference, update the userOptions object to match.
        for(var i=0; i<prefs.count; i++) {

            var k = app.typeIDToStringID(prefs.getKey(i));
            var v = prefs.getString(prefs.getKey(i));
            _userOptions[k] = v;

        }

    }


}

function savePrefs() {

    var prefs = new ActionDescriptor();

    // create an object that copies all key-value pairs from userOptions.
    var options = getKeys(_userOptions);
    var len = options.length;
    for(var i=0; i<len; i++) {
        var k = app.stringIDToTypeID(options[i]);
        prefs.putString(k, _userOptions[options[i]]);
    }

    // save and return.
    app.putCustomOptions(_prefsTitle, prefs, true);

}




function getUserOptions() {

	var dlg = new Window('dialog', _ScriptTitle);
	dlg.orientation = 'column';
    dlg.alignChildren = 'right';

    dlg.heroImage = dlg.add('image', [0,0,400,100], File(_folderSource+_SLASH+'source'+_SLASH+'res'+_SLASH+'logo.png'));

    dlg.introGrp = dlg.add('group', undefined);
    dlg.introGrp.alignment = 'center';
    dlg.introGrp.introText = dlg.introGrp.add('statictext', [0,0,400,40], 'Enter all relevant fields and choose which sizes you require, then click \"Apply changes\"', {multiline: true});


    dlg.interruptor01 = dlg.add('panel', undefined);
    dlg.interruptor01.size = [400, 1];
    dlg.interruptor01.alignment = 'center';

    dlg.nameEntry = dlg.add('group', undefined);
    dlg.nameEntry.size = [400, 90];
    dlg.nameEntry.orientation = 'column';
    dlg.nameEntry.alignChildren = 'right';

    dlg.nameEntry.retailerNameGrp = dlg.nameEntry.add('group', undefined);
    dlg.nameEntry.retailerNameGrp.orientation = 'row';

    dlg.nameEntry.retailerNameGrp.label01 = dlg.nameEntry.retailerNameGrp.add('statictext', undefined, 'Retailer name:');
    dlg.nameEntry.retailerNameGrp.entry01 = dlg.nameEntry.retailerNameGrp.add('edittext', undefined, (_userOptions['retailerName'] || ''));
    dlg.nameEntry.retailerNameGrp.entry01.characters = 30;
    dlg.nameEntry.retailerNameGrp.entry01.onChanging = function(e) { _userOptions['retailerName'] = dlg.nameEntry.retailerNameGrp.entry01.text }

    dlg.nameEntry.businessNameGrp = dlg.nameEntry.add('group', undefined);
    dlg.nameEntry.businessNameGrp.orientation = 'row';

    dlg.nameEntry.businessNameGrp.label02 = dlg.nameEntry.businessNameGrp.add('statictext', undefined, 'Legal business name:');
    dlg.nameEntry.businessNameGrp.entry02 = dlg.nameEntry.businessNameGrp.add('edittext', undefined, (_userOptions['businessName'] || ''));
    dlg.nameEntry.businessNameGrp.entry02.characters = 30;
    dlg.nameEntry.businessNameGrp.entry02.onChanging = function(e) { _userOptions['businessName'] = dlg.nameEntry.businessNameGrp.entry02.text }

    dlg.nameEntry.clickTagGrp = dlg.nameEntry.add('group', undefined);
    dlg.nameEntry.clickTagGrp.orientation = 'row';

    dlg.nameEntry.clickTagGrp.label03 = dlg.nameEntry.clickTagGrp.add('statictext', undefined, 'Target URL - http://');
    dlg.nameEntry.clickTagGrp.entry03 = dlg.nameEntry.clickTagGrp.add('edittext', undefined, (_userOptions['clickTag'] || ''));
    dlg.nameEntry.clickTagGrp.entry03.characters = 30;
    dlg.nameEntry.clickTagGrp.entry03.onChanging = function(e) { _userOptions['clickTag'] = dlg.nameEntry.clickTagGrp.entry03.text }

    // Required sizes selection group
    dlg.requiredSizesPnl = dlg.add('panel', [0,0,400,60+(30*_exportFormats.length)], "Choose required sizes");
    dlg.requiredSizesPnl.alignment = 'center';
    for( var i=0; i<_exportFormats.length; i++) {
        var chk = dlg.requiredSizesPnl.add('checkbox', [50,30+(30*i),150,30], _exportFormats[i].size+" ("+_exportFormats[i].name+")");
        var sizeOption = 'sizeOption'+i;
        _userOptions[sizeOption] = chk.value;
        chk.onClick = (function(thisOption,thisChk) {
            return function() { handleCheck(thisOption, thisChk)}
        })(sizeOption,chk);
    }

    // Submission group (Apply, OK (should mean leave but save changes?), Cancel (quit without saving));
	dlg.submissionGrp = dlg.add('group', undefined);
	dlg.submissionGrp.alignment = 'right';
	dlg.submissionGrp.but_apply = dlg.submissionGrp.add('button', undefined, 'Apply changes');
	dlg.submissionGrp.but_ok = dlg.submissionGrp.add('button', undefined, 'OK');
	dlg.submissionGrp.but_cancel = dlg.submissionGrp.add('button', undefined, 'Cancel');

	dlg.submissionGrp.but_apply.onClick = function(e) { handleApply(dlg) };
    dlg.submissionGrp.but_ok.onClick = function(e) { savePrefs(); dlg.close(); };

	dlg.center();
	dlg.show(); // 1 = ok, 2 = cancel


}

function handleCheck(sel,chk) {
    _userOptions[sel] = chk.value;
}

function handleApply(dlg) {

    // TO DO: No point running if no sizes are checked:
    var anySizesChecked = false;

    if(isMac) { app.system( "mkdir -p "+_folderSource+"/_temp");
    } else if(isWindows) { app.system( "mkdir "+_folderSource+"\\_temp"); }

    // Before anything else, validate the HTML entry field to make sure it's a legitimate address - no careful checking, just strip any protocol/scheme make it scheme-relative.
    var url = validateHtml(_userOptions['clickTag']);

    for(var i=0; i<_exportFormats.length; i++) {

        if(_userOptions["sizeOption"+i] == true) {

            anySizesChecked = true;

            var size = _exportFormats[i].size.replace(/ /g, "");
            var sizePath = _folderSource+_SLASH+"source"+_SLASH+size;

            // 3. Open and amend GIFs for all selected formats (error check: text layer exists)
            // 4. Save-for-web GIFs in target folder and close
            replaceGifText(sizePath+_SLASH+_manifest[1].title+_SLASH+_manifest[1].files[0], sizePath+_SLASH+_manifest[1].title, size);

            // 5. Find and replace copy in all selected HTML5 units (error checks: files exist, source copy exists)
            // 6. Save HTML5 in target folder (error check: target folder exists, file saved)
            // NEW! Add a hardcoded clickTag if required (perhaps should be greyed out by a checkbox?)
            replaceHtmlText(sizePath+_SLASH+_manifest[0].title+_SLASH+_manifest[0].files[0], sizePath+_SLASH+_manifest[0].title, size, url);

        }
    }

    if(anySizesChecked) {

        var dt = new Date();
        var dtString = "_"+dblDigit(dt.getFullYear())+dblDigit(dt.getMonth())+dblDigit(dt.getDate())+"_"+dblDigit(dt.getHours())+dblDigit(dt.getMinutes());

        // 7. ZIP output folder and conclude.
        if(isMac) {
            app.system( "mkdir -p "+_folderSource+"/_temp");
            app.system( "mkdir -p "+_folderSource+"/Output");
            app.system( "cd "+_folderSource+"/_temp; zip -r "+_folderSource+"/Output/"+_CarModel.replace(/ /g,"_")+dtString+".zip *");
            app.system( "rm -rf "+_folderSource+"/_temp");
        } else if(isWindows) {
            app.system( "mkdir "+_folderSource+"\\_temp");
            app.system( "mkdir "+_folderSource+"\\Output");
            app.system( "PowerShell -command Compress-Archive -Path "+_folderSource+"\\_temp\\* -DestinationPath "+_folderSource+"\\Output\\"+_CarModel.replace(/ /g,"_")+dtString+".zip");
            app.system( "rmdir /s/q "+_folderSource+"\\_temp");
        }

        alert("Zip is ready! Check the Output folder");

        savePrefs();

        dlg.active = true;

    } else {
        alert("No sizes are selected!");
    }


}


function checkFonts() {

	var missingFontsList = _reqFonts.slice(0);
	var numInstalledFonts = app.fonts.length;

	for (var i=0; i<_reqFonts.length; i++) {

		var isFound = false;
		for (var j=0; j<numInstalledFonts; j++) {
			if(app.fonts[j].postScriptName == _reqFonts[i]) {
				isFound = true;
				break;
			}
		}

		var indexToRemove = missingFontsList.indexOf(_reqFonts[i]);

		if (indexToRemove !== -1 && isFound === true) {
			missingFontsList.splice(indexToRemove, 1)
		}

	}

	
	if (missingFontsList.length > 0) {

        // TO DO: - The 'installed fonts' list doesn't seem to update without app restart. Either need to fix process or include in alert.

		var errorString = "The following fonts seem to be missing. Please install/activate and try again (you may need to restart Photoshop for the new fonts to be fully recognised):";
		for (var i=0; i<missingFontsList.length; i++) {
			errorString += "\n"+missingFontsList[i];
		}
		throw errorString;
	} else {
			// Conditional logic, maybe 'All fonts installed!' message?		
	}
}


function checkFilesAndFolders(manifest, reqSizes) {


    for (var i=0; i<reqSizes; i++) {

        // Check folder of required size exists
        var sizeNoSpaces = _exportFormats[i].size.replace(/ /g, "");
        var sizePath = _folderSource+_SLASH+"source"+_SLASH+sizeNoSpaces;  // eg "X:/Banners/728x90"
        check(sizePath, "folder");

        // Check each sub-folder exists
        for(var j=0; j<manifest.length; j++) {

            var folderPath = sizePath+_SLASH+manifest[j].title; // eg "X:/Banners/728x90/HTML"
            check(folderPath, "folder");

            for(var k=0; k<manifest[j].files.length; k++) {

                var filePath = folderPath+_SLASH+manifest[j].files[k]; // eg "X:/Banners/728x90/HTML/index.html"
                check(filePath, "file");

            }

        }

    }

    function check(obj,typ) {

        var missingFolders = [];
        var missingFiles = [];

        var fileOrFolder = Folder(obj);

        // Looking for folders?
        if(typ === 'folder') {
            // If it's a file, or it doesn't exist, complain:
            if(fileOrFolder.constructor != Folder || fileOrFolder.exists == false) {
                missingFolders.push(obj.replace(_folderSource,""));
            }
        } else if (typ === 'file') {
            // If it's a folder, or it doesn't exist, complain:
            if(fileOrFolder.constructor == Folder || fileOrFolder.exists == false) {
                missingFiles.push(obj.replace(_folderSource,""));
            }
        }

        // DUH this will always only ever throw the first error that it comes across (rather than a list of all missing files), as the check is called by an external loop.
        // But, eh, whatever. At the moment there's only one necessary file in each folder anyway, so it's not a massive problem.

        if(missingFolders.length > 0) {
            var folderErrorString = "The following folder(s) appear to be missing. Please check before continuing:";
            for(var i=0; i<missingFolders.length; i++) {
                folderErrorString += "\n"+missingFolders[i];
            }
            throw folderErrorString;
        }

        if(missingFiles.length > 0) {
            var fileErrorString = "The following file(s) appear to be missing. Please check before continuing:";
            for(var j=0; j<missingFiles.length; j++) {
                fileErrorString += "\n"+missingFiles[j];
            }
            throw fileErrorString;
        }

    }

}



function replaceHtmlText(targetFile,path,size,url) {
	var file = new File(targetFile);

	file.open("r");
	var origText = file.read();
	file.open("w");

    var retailerTemp = _userOptions['retailerName'];
    if(size.indexOf("160x600") > -1) { retailerTemp = retailerTemp.replace(/(\\r)/g, '<br/>') };

	var edit1 = origText.replace(/(<span class="retailer">(.*?)<\/span>)/g,"<span class=\"retailer\">"+retailerTemp+"</span>");
    var edit2 = edit1.replace(/(<span class="legal">(.*?)<\/span>)/g,"<span class=\"legal\">"+_userOptions['businessName']+"</span>");
    var edit3 = edit2.replace(/(var clickTag =(.*?);)/g, "var clickTag = \""+url+"\";")
	// regex find the div element with the retailer/business name (by element rather than content, in case it's already changed from default)

	file.write(edit3);
	file.close();

    if(isMac) {
        app.system( "cp -R " + path + " "+ _folderSource + "/_temp/" + size );
    } else if(isWindows) {
        app.system( "xcopy /e "+ path + " "+ _folderSource + "\\_temp\\" + size+"\\")
    }

}

function replaceGifText(targetFile,path,size) {
	var fileToEdit = new File(targetFile);
	var doc = app.open(fileToEdit);
	app.activeDocument = doc;
	var textLayerToEdit = doc.layerSets.getByName("RetailerName").layers[0];

    // The skyscraper needs a line break between 'at' and 'retailer'...
    var lineBreak = "";
    if(size.indexOf("160x600") > -1) { lineBreak = "\r" };

	textLayerToEdit.textItem.contents = "AT "+lineBreak+_userOptions['retailerName'];

    if(size.indexOf("160x600") > -1) {
        var cta = doc.layerSets.getByName("CTA");
        // count incidence of (manually included) line breaks, move CTA group accordingly.
        var lines = _userOptions['retailerName'].match(/(\\r)/g);
        var numLines = (lines != null) ? lines.length : 0;
        cta.translate(new UnitValue(0, "px"), new UnitValue(14*numLines, "px"));
    }

	var saveIt = SFW(path,size);
	if(saveIt === true) {
		doc.close(SaveOptions.DONOTSAVECHANGES);
	} else {
        throw "Error saving animated GIF!";
    }
}




///// UTILS

function checkIsWindows() {    
  return app.systemInformation.search(/Operating System: Windows (8|10)/gi) >= 0    
}    
function checkIsMac() {    
  return app.systemInformation.indexOf("Operating System: Mac") >= 0    
}   

/*function checkOS() {
    if(app.systemInformation.indexOf("Operating System: Mac") == -1) {
        throw "Unfortunately this generator only works on Mac for now..."
    }
}*/

function validateHtml(url) {
    var newURL = "http://"+url.replace(/^(https?:|)\/\//, "");
    return newURL;
}

function dblDigit(n) {
    return ("0"+n).slice(-2);
}


//
//==================== GIF 'Save For Web' action (converted using xTools) ==============
//

function SFW(path,size) {
	cTID = function(s) { return app.charIDToTypeID(s); };
	sTID = function(s) { return app.stringIDToTypeID(s); };
  // Export
  function step1(enabled, withDialog) {
    if (enabled != undefined && !enabled)
      return;

    if(isMac) {
        app.system( "mkdir -p "+ path + "/output");
    } else if(isWindows) {
        app.system( "mkdir "+ path + "\\output");
    }

    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(cTID('Op  '), cTID('SWOp'), cTID('OpSa'));
    desc2.putBoolean(cTID('DIDr'), true);
    desc2.putPath(cTID('In  '), new File(path+_SLASH+"output"+_SLASH));
    desc2.putString(cTID('ovFN'), size+"_backup.gif");
    desc2.putEnumerated(cTID('Fmt '), cTID('IRFm'), cTID('GIFf'));
    desc2.putBoolean(cTID('Intr'), false);
    desc2.putEnumerated(cTID('RedA'), cTID('IRRd'), cTID('Adpt'));
    desc2.putBoolean(cTID('RChT'), false);
    desc2.putBoolean(cTID('RChV'), false);
    desc2.putBoolean(cTID('AuRd'), false);
    desc2.putInteger(cTID('NCol'), 256);
    desc2.putInteger(cTID('DChS'), 0);
    desc2.putInteger(cTID('DCUI'), 0);
    desc2.putBoolean(cTID('DChT'), false);
    desc2.putBoolean(cTID('DChV'), false);
    desc2.putInteger(cTID('WebS'), 0);
    desc2.putEnumerated(cTID('TDth'), cTID('IRDt'), cTID('None'));
    desc2.putInteger(cTID('TDtA'), 100);
    desc2.putInteger(cTID('Loss'), 10);
    desc2.putInteger(cTID('LChS'), 0);
    desc2.putInteger(cTID('LCUI'), 100);
    desc2.putBoolean(cTID('LChT'), false);
    desc2.putBoolean(cTID('LChV'), false);
    desc2.putBoolean(cTID('Trns'), true);
    desc2.putBoolean(cTID('Mtt '), true);
    desc2.putEnumerated(cTID('Dthr'), cTID('IRDt'), cTID('Dfsn'));
    desc2.putInteger(cTID('DthA'), 0);
    desc2.putInteger(cTID('MttR'), 255);
    desc2.putInteger(cTID('MttG'), 255);
    desc2.putInteger(cTID('MttB'), 255);
    desc2.putBoolean(cTID('SHTM'), false);
    desc2.putBoolean(cTID('SImg'), true);
    desc2.putEnumerated(cTID('SWsl'), cTID('STsl'), cTID('SLAl'));
    desc2.putEnumerated(cTID('SWch'), cTID('STch'), cTID('CHsR'));
    desc2.putEnumerated(cTID('SWmd'), cTID('STmd'), cTID('MDCC'));
    desc2.putBoolean(cTID('ohXH'), false);
    desc2.putBoolean(cTID('ohIC'), true);
    desc2.putBoolean(cTID('ohAA'), true);
    desc2.putBoolean(cTID('ohQA'), true);
    desc2.putBoolean(cTID('ohCA'), false);
    desc2.putBoolean(cTID('ohIZ'), true);
    desc2.putEnumerated(cTID('ohTC'), cTID('SToc'), cTID('OC03'));
    desc2.putEnumerated(cTID('ohAC'), cTID('SToc'), cTID('OC03'));
    desc2.putInteger(cTID('ohIn'), -1);
    desc2.putEnumerated(cTID('ohLE'), cTID('STle'), cTID('LE03'));
    desc2.putEnumerated(cTID('ohEn'), cTID('STen'), cTID('EN00'));
    desc2.putBoolean(cTID('olCS'), false);
    desc2.putEnumerated(cTID('olEC'), cTID('STst'), cTID('ST00'));
    desc2.putEnumerated(cTID('olWH'), cTID('STwh'), cTID('WH01'));
    desc2.putEnumerated(cTID('olSV'), cTID('STsp'), cTID('SP04'));
    desc2.putEnumerated(cTID('olSH'), cTID('STsp'), cTID('SP04'));
    var list1 = new ActionList();
    var desc3 = new ActionDescriptor();
    desc3.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC00'));
    list1.putObject(cTID('SCnc'), desc3);
    var desc4 = new ActionDescriptor();
    desc4.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC19'));
    list1.putObject(cTID('SCnc'), desc4);
    var desc5 = new ActionDescriptor();
    desc5.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC28'));
    list1.putObject(cTID('SCnc'), desc5);
    var desc6 = new ActionDescriptor();
    desc6.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC24'));
    list1.putObject(cTID('SCnc'), desc6);
    var desc7 = new ActionDescriptor();
    desc7.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC24'));
    list1.putObject(cTID('SCnc'), desc7);
    var desc8 = new ActionDescriptor();
    desc8.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC24'));
    list1.putObject(cTID('SCnc'), desc8);
    desc2.putList(cTID('olNC'), list1);
    desc2.putBoolean(cTID('obIA'), false);
    desc2.putString(cTID('obIP'), "");
    desc2.putEnumerated(cTID('obCS'), cTID('STcs'), cTID('CS01'));
    var list2 = new ActionList();
    var desc9 = new ActionDescriptor();
    desc9.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC01'));
    list2.putObject(cTID('SCnc'), desc9);
    var desc10 = new ActionDescriptor();
    desc10.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC20'));
    list2.putObject(cTID('SCnc'), desc10);
    var desc11 = new ActionDescriptor();
    desc11.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC02'));
    list2.putObject(cTID('SCnc'), desc11);
    var desc12 = new ActionDescriptor();
    desc12.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC19'));
    list2.putObject(cTID('SCnc'), desc12);
    var desc13 = new ActionDescriptor();
    desc13.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC06'));
    list2.putObject(cTID('SCnc'), desc13);
    var desc14 = new ActionDescriptor();
    desc14.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC24'));
    list2.putObject(cTID('SCnc'), desc14);
    var desc15 = new ActionDescriptor();
    desc15.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC24'));
    list2.putObject(cTID('SCnc'), desc15);
    var desc16 = new ActionDescriptor();
    desc16.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC24'));
    list2.putObject(cTID('SCnc'), desc16);
    var desc17 = new ActionDescriptor();
    desc17.putEnumerated(cTID('ncTp'), cTID('STnc'), cTID('NC22'));
    list2.putObject(cTID('SCnc'), desc17);
    desc2.putList(cTID('ovNC'), list2);
    desc2.putBoolean(cTID('ovCM'), false);
    desc2.putBoolean(cTID('ovCW'), false);
    desc2.putBoolean(cTID('ovCU'), true);
    desc2.putBoolean(cTID('ovSF'), true);
    desc2.putBoolean(cTID('ovCB'), true);
    desc2.putString(cTID('ovSN'), "images");
    desc1.putObject(cTID('Usng'), sTID("SaveForWeb"), desc2);
    executeAction(cTID('Expr'), desc1, dialogMode);
    return true;
  };

    var runit = step1(); // Export

    if (runit === true) {
        if(isMac) {
            app.system( "mkdir -p " + _folderSource + "/_temp/Backups" + "&& cp " + path + "/output/" + size + "_backup.gif" + " " + _folderSource + "/_temp/Backups/" );
            app.system( "rm -rf "+ path + "/output");
        } else if(isWindows) {
            app.system( "mkdir " + _folderSource + "\\_temp\\Backups" );
            app.system( "xcopy "+path+"\\output\\"+size+"_backup.gif"+" "+_folderSource+"\\_temp\\Backups\\");
            app.system( "rmdir "+path+"\\output");
        }
		return true;
    } else {
    	return false;
    };
};




