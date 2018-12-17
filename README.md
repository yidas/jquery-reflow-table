<p align="center">
    <a href="https://jquery.com" target="_blank">
        <img src="https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/JQuery_logo.svg/220px-JQuery_logo.svg.png" height="50px">
    </a>
        <h1 align="center"><i>RWD</i> Reflow Table</h1>
    <br>
</p>

[![npm version](https://badge.fury.io/js/jquery-reflow-table.svg)](https://badge.fury.io/js/jquery-reflow-table)
[![Bower version](https://badge.fury.io/bo/jquery-reflow-table.svg)](https://badge.fury.io/bo/jquery-reflow-table)

RWD reflow table switch for mobile UI/UX by collapsing columns

FEATURES
--------

- ***High performance** and **data consistency** with Mobile UI/UX*

- ***Pseudo** element implementation*

- ***[DataTables](https://datatables.net/)** library Integration*


---

OUTLINE
-------

- [Demonstration](#demonstration)
- [Requirements](#requirements)
- [Installation](#installation)
    - [Bower Installation](#bower-installation)
    - [Assets include](#assets-include)
    - [Initailize via JavaScript](#initailize-via-javascript)
    - [Options](#options)
- [Implementation](#implementation)
    - [Update for Dynamic Content](#update-for-dynamic-content)
        - [DataTables Integration](#dataTables-integration)
    - [Customize Styles](#customize-styles)
- [Events](#events)
- [API Usage](#api-usage)

---

DEMONSTRATION
-------------

[https://yidas.github.io/jquery-reflow-table/](https://yidas.github.io/jquery-reflow-table/)

<a href="https://yidas.github.io/jquery-reflow-table/" target="_blank"><img src="https://raw.githubusercontent.com/yidas/jquery-reflow-table/master/img/demo-origin.png" height="300"/></a>
<a href="https://yidas.github.io/jquery-reflow-table/" target="_blank"><img src="https://raw.githubusercontent.com/yidas/jquery-reflow-table/master/img/demo-mobile.png" height="300"/></a>

After applying Reflow-Table, the table will be responsive with reflow mode, which can be switch by browser's width or customized events.

---

REQUIREMENTS
------------
This library requires the following:

- jQuery 1.11.0+ | 2.0+ | 3.0+

---

INSTALLATION
------------

### Bower Installation

```
bower install jquery-reflow-table
```

> You could also download by NPM or directly copy [`dist`](https://github.com/yidas/jquery-reflow-table/tree/master/dist) assets. ([Last Release for download](https://github.com/yidas/jquery-reflow-table/releases))

### Assets include

Add CSS file into the `<head>`:

```html
<link href="css/reflow-table.css" rel="stylesheet">
```

Add JavaScript file either into the `<head>`, or the bottom of `<body>`:

```html
<script type="text/javascript" src="js/reflow-table.js"></script>
```


### Markup

Add the classes `.table` to the tables as usual when using Bootstrap, then wrap them with a identity such as `.freeze-table`

```html
<table class="table">
  <thead>
    <th>...</th>
  </thead>
  <tbody>
    <td>...</td>
  <tbody>
</table>
```

### Initailize via JavaScript

You can initialize Table Reflow by jQuery extension call:

```html
<script>
   $(function() {
      $('.reflow-table').reflowTable({});
   });
</script>
```

Or initialize an element by newing object from Table Reflow class:

```html
<script>
   $(function() {
      new ReflowTable('.reflow-table', {});
   });
</script>
```

> The parameter `{}` is [options](#options) configuration



### Options

Options could be passed via JavaScript with object.

|Name         |Type    |Default            |Description|
|:--          |:--     |:--                |:--        |
|namespace    |string  |'reflow-table'     |Table namespace for unbind|
|autoWidth    |integer |736                |Detected width like `@media`, `null` for disabling auto detection|
|widthRatio   |string  |'50'               |Set pseudo heads' width ratio in mobile mode. (`15`, `20`, `25`, `30`,`40`,`50`)|
|widthSize    |string  |null               |Set pseudo heads' width size in mobile mode. (`xs`, `sm`, `md`, `lg`)|
|thead        |element |thead element of current table |The `thead` element with table titles used to build mobile mode for current `tbody`, you could specific from another table.|
|eventMobileOn |callable|null    |[Event](#events) callback function referred by `reflow-table.mobile.on` event|
|eventMobileOff|callable|null    |[Event](#events) callback function referred by `reflow-table.mobile.off` event|

---

IMPLEMENTATION
--------------

### Update for Dynamic Content

There is an update method which you can call when the table content has changed like page switching. The method will update or re-build table to ensure that everything is alright for mobile mode.

```javascript
$('.reflow-table').reflowTable('update');
```

Or using API usage to update:

```javascript
var reflowTable = new ReflowTable('.reflow-table');
// Update Freeze Table while the original table is distorted
function afterTablePageChanged() {
   reflowTable.update();
}
```

#### DataTables Integration

[DataTables](https://datatables.net/) is a jQuery library to add advanced interaction controls to your HTML tables the free & easy way.

To integrate with [DataTables](https://datatables.net/), you can apply a table with reflowTable before or after applying DataTables, set Reflow Table's `update` into DataTables callback such as `drawCallback` to keep updating data. For example:

```javascript
var datatables = $('#table-datatables').DataTable({
  
  "drawCallback": function( settings ) {
    
    $("#table-datatables").reflowTable('update');
  }
});

var reflowDataTable = $("#table-datatables").reflowTable();
```

*Example: [DataTables Library Integration](https://yidas.github.io/jquery-reflow-table/#datatables)*

> For DataTables integration, we choose `drawCallback` to implement Reflow Table update. After all, DataTables `page.dt` event fires too early before drawing, while `createdRow` has a lack of flexibility.

### Customize Styles

You could customize pseudo `td` styles by defining CSS for Table Reflow:

```html
<style>
/* Table Reflow Customized CSS for pseudo heads */
.reflow-table td:before {
    min-width: 160px !important;
    text-transform: uppercase;
}
</style>
```

---

EVENTS
------

This library exposes a few events for hooking into reflow-table functionality.

|Event Type             |Description|
|:--                    |:--     |
|reflow-table.mobile.on |This event fires immediately when the table is changed to mobile mode, this can be triggerd by [mobileMode()](#mobilemode) method call.|
|reflow-table.mobile.off|This event fires immediately when the table is changed back from mobile mode, this can be triggerd by [mobileMode()](#mobilemode) method call.|

*Example:*

```javascript
$("#table").on('reflow-table.mobile.on', function() {
  alert('Mobile mode is now ON');
});
```

---

API USAGE
---------

### update()

Update or re-build each Reflow Table row th title for dynamic table content

*See [Update for Dynamic Content](#update-for-dynamic-content)*

### mobileMode()

Switch table to mobile mode or not

```javascript
function boolean mobileMode(enable=true)
```

*Example: [Toggle Mobile Mode by Button](https://yidas.github.io/jquery-reflow-table/#toggle-mode)*

```javascript
var reflowTable = $('#myTable').reflowTable();

$(".btn-mobile-on").click(function () {
  reflowTable.mobileMode(true);  // Switch to mobile mode
});

$(".btn0-mobile-off").click(function () {
  reflowTable.mobileMode(false); // Switch back to non-mobile mode
});
```

### destroy()

Destroy Freeze Table by same namespace

*Example:*

```javascript
var reflowTable = $('#myTable').reflowTable();
 
$('#tableDestroy').on( 'click', function () {
    reflowTable.destroy();
} );
```

### unbind()

Unbind all events by same namespace


