// FORM VALIDATION
function validateForm() {
    var pid = document.getElementById("pid").value;
    var pname = document.getElementById("pname").value;
    // var image = document.getElementById("image").files[0].name;
    var price = document.getElementById("price").value;
    var descp = document.getElementById("descp").value;

    if (pid == "" || pname == "" || price == "" || descp == "") {
        alert("Enter complete data !");
        return false;
    }
    return true;
}

// SHOW DATA FROM LOCAL STORAGE
function showData() {
    var peopleList;
    if (localStorage.getItem("peopleList") == null) {
        peopleList = [];
    }
    else {
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }

    var html = "";
    peopleList.forEach(function (element, index) {
        html += "<tr>";
        html += "<td>" + element.pid + "</td>";
        html += "<td>" + element.pname + "</td>";
        html += "<td><img style='width:100px; height:100px' src = '" + element.image + "'></td>";
        html += "<td>" + element.price + "</td>";
        html += "<td>" + element.descp + "</td>";
        html += '<td><button onclick="deleteData(' + index + ')" class="btn btn-danger">Delete</button><button onclick="updateData(' + index + ')" class="btn btn-warning">Update</button></td>';
        html += "</tr>";
    });

    document.querySelector("#productTable tbody").innerHTML = html;
}


// LOADS ALL DATA ON PAGE REFRESHMENT
document.onload = showData();


// ADD DATA TO LOCAL STORAGE
function AddData() {
    if (validateForm() == true) {
        var pid = document.getElementById("pid").value;
        var pname = document.getElementById("pname").value;
        var image = document.getElementById("image").files[0].name;
        var price = document.getElementById("price").value;
        var descp = document.getElementById("descp").value;

        var peopleList;
        if (localStorage.getItem("peopleList") == null) {
            peopleList = [];
        }
        else {
            peopleList = JSON.parse(localStorage.getItem("peopleList"));
        }

        peopleList.push({
            pid: pid,
            pname: pname,
            image: image,
            price: price,
            descp: descp,

        });
        localStorage.setItem("peopleList", JSON.stringify(peopleList));
        showData();
        document.getElementById("pid").value = "";
        document.getElementById("pname").value = "";
        document.getElementById("image").value = "";
        document.getElementById("price").value = "";
        document.getElementById("descp").value = "";
    }
}

//DELETE DATA FROM LOCAL STORAGE
function deleteData(index) {
    var peopleList;
    if (localStorage.getItem("peopleList") == null) {
        peopleList = [];
    }
    else {
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }

    peopleList.splice(index, 1);
    localStorage.setItem("peopleList", JSON.stringify(peopleList));
    showData();
}

//EDIT DATA FROM LOCAL STORAGE
function updateData(index) {
    document.getElementById("Submit").style.display = "none";
    document.getElementById("Update").style.display = "block";

    var peopleList;
    if (localStorage.getItem("peopleList") == null) {
        peopleList = [];
    }
    else {
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }

    document.getElementById("pid").value = peopleList[index].pid;
    document.getElementById("pname").value = peopleList[index].pname;
    // document.getElementById("image").files[0] = peopleList[index].image;
    document.getElementById("price").value = peopleList[index].price;
    document.getElementById("descp").value = peopleList[index].descp;

    document.querySelector("#Update").onclick = function () {
        if (validateForm() == true) {
            peopleList[index].pid = document.getElementById("pid").value;
            peopleList[index].pname = document.getElementById("pname").value;
            if(document.getElementById("image").files[0]){
                peopleList[index].image = document.getElementById("image").files[0].name;
            }
            else{
                console.log("No image upated");
            }
            // peopleList[index].image = document.getElementById("image").files[0].name;
            peopleList[index].price = document.getElementById("price").value;
            peopleList[index].descp = document.getElementById("descp").value;

            localStorage.setItem("peopleList", JSON.stringify(peopleList));

            showData();

            document.getElementById("pid").value = "";
            document.getElementById("pname").value = "";
            document.getElementById("image").files[0].name = "";
            document.getElementById("price").value = "";
            document.getElementById("descp").value = "";

            document.getElementById("Submit").style.display = "block";
    document.getElementById("Update").style.display = "none";
        }
    }
}


//SEARCH BY PRODUCT ID
function search(){
    let input,filter,table,tr,td,i,txtValue;
    input = document.getElementById('search-input')
    filter = input.value.toUpperCase()
    table = document.getElementById('productTable')
    tr = table.getElementsByTagName('tr');

    for(i=0; i<tr.length; i++){
        td = tr[i].getElementsByTagName('td')[0]
        if(td){
            txtValue = td.textContent || td.innerText

            if(txtValue.toUpperCase().indexOf(filter) > -1){
                tr[i].style.display = ''
            }
            else{
                tr[i].style.display = 'none'
            }
        }
    }

}


//SORTING BY TABLE ATTRIBUTES
function sortTableByColumn(table, column, asc = true) {
	const dirModifier = asc ? 1 : -1;
	const tBody = table.tBodies[0];
	const rows = Array.from(tBody.querySelectorAll("tr"));

	// Sort each row
	const sortedRows = rows.sort((a, b) => {
		const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
		const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

		return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
	});

	// Remove all existing TRs from the table
	while (tBody.firstChild) {
		tBody.removeChild(tBody.firstChild);
	}

	// Re-add the newly sorted rows
	tBody.append(...sortedRows);

	// Remember how the column is currently sorted
	table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
	table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
	table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll("#productTable th").forEach(headerCell => {
	headerCell.addEventListener("click", () => {
		const tableElement = headerCell.parentElement.parentElement.parentElement;
		const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
		const currentIsAscending = headerCell.classList.contains("th-sort-asc");

		sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
	});
});