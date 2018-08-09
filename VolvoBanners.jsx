// Shim to allow font list searching with TEN YEAR OLD native JS methods, FFS.
if (typeof Array.prototype.indexOf != "function") {  
    Array.prototype.indexOf = function (el) {  
        for(var i = 0; i < this.length; i++) if(el === this[i]) return i;  
        return -1;  
        }  
}  


#target photoshop;

const _folderSource = $.includePath; // The current folder location

const _ScriptTitle = "Volvo Q3 Banner Automation";

// Default required fonts for Volvo creative. Not all may be needed for any given banner, but safer to ensure all are available.
const _reqFonts = ["VolvoBroadPro", "VolvoSansPro", "VolvoSansPro-Bold", "VolvoSansPro-Light", "VolvoSansPro-Medium"];

const _exportFormats = [{size:"300 x 250",name:"MPU"},{size:"160 x 600",name:"Wide Sky"}/*,{size:"728 x 90",name:"Leaderboard"}*/];

const _manifest = [
                    {   title:  "HTML",
                        files:[ "index.html"]
                    },
                    {   title:  "GIF",
                        files:[ "backup_source.psd"]
                    }
                ];

var _userOptions = {};


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

	// DONE! 1. ensure fonts are loaded
	checkFonts();
	// 1b. incorporate messaging that reports all fonts are installed (list in dialog panel?)

	// DONE! 2. ensure necessary files are in the right place
    checkFilesAndFolders(_manifest, _exportFormats.length);

	// 3. Build interface and capture user input
	getUserOptions();

    // steps 4+ are in handleApply()


}

function getUserOptions() {

	var dlg = new Window('dialog', _ScriptTitle);
	//dlg.size = {width: 600, height:600};

	dlg.introGrp = dlg.add('group', undefined);
	dlg.introGrp.alignment = 'left';
	dlg.introGrp.introText = dlg.introGrp.add('statictext', undefined, 'Here you can customise your banners according to your specific requirements...');



	dlg.interruptor01 = dlg.add('panel', [0,0,500,0]);
	dlg.interruptor01.alignment = 'left';



	dlg.nameEntry = dlg.add('group', undefined);
	dlg.nameEntry.orientation = 'column';
	dlg.nameEntry.alignChildren = 'right';

	dlg.nameEntry.retailerNameGrp = dlg.nameEntry.add('group', undefined);
	dlg.nameEntry.retailerNameGrp.orientation = 'row';

	dlg.nameEntry.retailerNameGrp.label01 = dlg.nameEntry.retailerNameGrp.add('statictext', undefined, 'Retailer name:');
	dlg.nameEntry.retailerNameGrp.entry01 = dlg.nameEntry.retailerNameGrp.add('edittext', undefined, '');
	dlg.nameEntry.retailerNameGrp.entry01.characters = 30;
    dlg.nameEntry.retailerNameGrp.entry01.onChanging = function() { _userOptions['retailerName'] = dlg.nameEntry.retailerNameGrp.entry01.text }
	
	dlg.nameEntry.businessNameGrp = dlg.nameEntry.add('group', undefined);
	dlg.nameEntry.businessNameGrp.orientation = 'row';

	dlg.nameEntry.businessNameGrp.label02 = dlg.nameEntry.businessNameGrp.add('statictext', undefined, 'Legal business name:');
	dlg.nameEntry.businessNameGrp.entry02 = dlg.nameEntry.businessNameGrp.add('edittext', undefined, '');
	dlg.nameEntry.businessNameGrp.entry02.characters = 30;
    _userOptions['businessName'] = dlg.nameEntry.businessNameGrp.entry02.value;



    // Required sizes selection group
    dlg.requiredSizesPnl = dlg.add('panel', [0,0,300,60+(30*_exportFormats.length)], "Choose required sizes");
    dlg.requiredSizesPnl.alignment = 'left';
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
	//dlg.submissionGrp.but_ok = dlg.submissionGrp.add('button', undefined, 'OK');
	dlg.submissionGrp.but_cancel = dlg.submissionGrp.add('button', undefined, 'Cancel');

	dlg.submissionGrp.but_apply.onClick = function() { handleApply() };

	/*function handleApply() {
		replaceHtmlText(_folderSource+"/HTML/300x250/index.html",dlg.nameEntry.retailerNameGrp.entry01.text);
		replaceGifText(_folderSource+"/GIF/AnimatedGIF_test.psd",dlg.nameEntry.retailerNameGrp.entry01.text);
	}*/

	dlg.center();
	dlg.show(); // 1 = ok, 2 = cancel


}

function handleCheck(sel,chk) {
    _userOptions[sel] = chk.value;
}

function handleApply() {

    for(var i=0; i<_exportFormats.length; i++) {
        if(_userOptions["sizeOption"+i] == true) {

            // 3. Open and amend GIFs for all selected formats (error check: text layer exists)
            // 4. Save-for-web GIFs in target folder and close
            replaceHtmlText(_folderSource+"/source/"+_exportFormats[i].size.replace(/ /g, "")+_manifest[0].title+"/"+_manifest[0].files[0],
                            _userOptions['retailerName']);


            // 5. Find and replace copy in all selected HTML5 units (error checks: files exist, source copy exists)
            // 6. Save HTML5 in target folder (error check: target folder exists, file saved)

        }
    }
    // 7. ZIP output folder and conclude.

}

/// REDUNDANT, should bin
/*function handleTextChange(t) {

	alert(t);

	// NB Needs error testing for the document title, contents etc.
	var thisDoc = app.activeDocument;
	var textTarget = (thisDoc.layers.getByName('TextToChange'));
	textTarget.textItem.contents = t;

}*/

function checkFonts() {

	var missingFontsList = _reqFonts.slice(0);
	var numInstalledFonts = app.fonts.length;

    //check all fonts beginning with 'V'
    /*for (var i=0; i<numInstalledFonts; i++) {
        if(app.fonts[i].postScriptName.indexOf('V') == 0) {
            alert(app.fonts[i].postScriptName);
        }
    }*/

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

		var errorString = "The following fonts seem to be missing. Please install/activate and try again: ";
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
        var sizePath = _folderSource+"/source/"+sizeNoSpaces;  // eg "X:/Banners/728x90"
        check(path, "folder");

        // Check each sub-folder exists
        for(var j=0; j<manifest.length; j++) {

            var folderPath = sizePath+"/"+manifest[j].title; // eg "X:/Banners/728x90/HTML"
            check(folderPath, "folder");

            for(var k=0; k<manifest[j].files.length; k++) {

                var filePath = folderPath+"/"+manifest[j].files[k]; // eg "X:/Banners/728x90/HTML/index.html"
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



function replaceHtmlText(targetFile,newText) {
	var file = new File(targetFile);

	file.open("r");
	var origText = file.read();
	file.open("w");

	var editText = origText.replace(/(<div id="titleText">(.*)<\/div>)/g,"<div id=\"titleText\">"+newText+"</div>");
	// regex find the div element with the retailer name (by element rather than content, in case it's already changed from default)

	file.write(editText);
	file.close();
	alert("HTML file updated!");
}

function replaceGifText(targetFile,newText) {
	var fileToEdit = new File(targetFile);
	var doc = app.open(fileToEdit);
	app.activeDocument = doc;
	var textLayerToEdit = doc.layerSets.getByName("RetailerName").layers[0];
	textLayerToEdit.textItem.contents = "AT "+newText;
	alert("GIF file updated!");
	//saveForWeb(doc);
	var saveIt = SFW();
	if(saveIt === true) {
		doc.close(SaveOptions.DONOTSAVECHANGES);
	} else {
        throw "Error saving animated GIF!";
    }
}



///// UTILS

function checkAlreadyOpen(file) {
	if (app.documents.length > 0) {
		for(var i=0; i<app.documents.length; i++) {

		}
	} else {
		return false;
	}
}


//
//==================== GIF 'Save For Web' action (converted using xTools) ==============
//

function SFW(format) {
	cTID = function(s) { return app.charIDToTypeID(s); };
	sTID = function(s) { return app.stringIDToTypeID(s); };
  // Export
  function step1(enabled, withDialog) {
    if (enabled != undefined && !enabled)
      return;
    var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
    var desc1 = new ActionDescriptor();
    var desc2 = new ActionDescriptor();
    desc2.putEnumerated(cTID('Op  '), cTID('SWOp'), cTID('OpSa'));
    desc2.putBoolean(cTID('DIDr'), true);
    desc2.putPath(cTID('In  '), new File($.includePath+"../Output/Backup/"));
    desc2.putString(cTID('ovFN'), "testOut.gif");
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
		return true;
	} else {
		return false;
	};
};




