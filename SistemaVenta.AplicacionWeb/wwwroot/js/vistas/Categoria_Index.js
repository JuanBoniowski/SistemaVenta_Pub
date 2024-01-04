﻿const MODEL_BASE = {
    idCategoria: 0,
    descripcion: "",    
    esActivo: 1,    
}


let tablaData;

$(document).ready(function () {

    tablaData = $('#tbdata').DataTable({
        responsive: true,
        "ajax": {
            "url": '/Categoria/Lista',
            "type": "GET",
            "datatype": "json"
        },
        "columns": [
            { "data": "idCategoria", "visible": false, "searchable": false },
            { "data": "descripcion" },
            {
                "data": "esActivo", render: function (data) {
                    if (data == 1)
                        return '<span class="badge badge-info">Activo</span>';
                    else
                        return '<span class="badge badge-danger">No Activo</span>';
                }
            },
            {
                "defaultContent": '<button class="btn btn-primary btn-editar btn-sm mr-2"><i class="fas fa-pencil-alt"></i></button>' +
                    '<button class="btn btn-danger btn-eliminar btn-sm"><i class="fas fa-trash-alt"></i></button>',
                "orderable": false,
                "searchable": false,
                "width": "80px"
            }
        ],
        order: [[0, "desc"]],
        dom: "Bfrtip",
        buttons: [
            {
                text: 'Exportar Excel',
                extend: 'excelHtml5',
                title: '',
                filename: 'Reporte Categorias',
                exportOptions: {
                    columns: [1,2]
                }
            }, 'pageLength'
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json"
        },
    });
})

function mostrarModel(modelo = MODEL_BASE) {
    $("#txtId").val(modelo.idCategoria)
    $("#txtDescripcion").val(modelo.descripcion)
    $("#cboEstado").val(modelo.esActivo)

    $("#modalData").modal("show")
}

$("#btnNuevo").click(function () {
    mostrarModel()
})

$("#btnGuardar").click(function () {

    if ($("#txtDescripcion").val().trim()=="") {
        toastr.warning("", "Debe completar el caompo : descripcion ")
        $("#txtDescripcion").focus()
        return;
    }

    const modelo = structuredClone(MODEL_BASE);


    modelo["idCategoria"] = parseInt($("#txtId").val())
    modelo["descripcion"] = $("#txtDescripcion").val()
    modelo["esActivo"] = $("#cboEstado").val()

    const inputFoto = document.getElementById("txtFoto")

    $("#modalData").find("div.modal-content").LoadingOverlay("show");

    if (modelo.idCategoria == 0) {

        fetch("/Categoria/Crear", {
            method: "POST",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(response => {
                $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJson => {

                if (responseJson.estado) {

                    tablaData.row.add(responseJson.objecto).draw(false)
                    $("#modalData").modal("hide")
                    swal("Listo!", "La categoria fue creado", "success")
                } else {
                    swal("Los Sentimos", responseJson.mensaje, "error")
                }
            })
    } else {
        fetch("/Categoria/Editar", {
            method: "PUT",
            headers: { "Content-Type": "application/json; charset=utf-8" },
            body: JSON.stringify(modelo)
        })
            .then(response => {
                $("#modalData").find("div.modal-content").LoadingOverlay("hide");
                return response.ok ? response.json() : Promise.reject(response);
            })
            .then(responseJson => {

                if (responseJson.estado) {

                    tablaData.row(filaSeleccionada).data(responseJson.objecto).draw(false);
                    filaSeleccionada = null;
                    $("#modalData").modal("hide")
                    swal("Listo!", "la Categoria fue modificarda", "success")
                } else {
                    swal("Los Sentimos", responseJson.mensaje, "error")
                }
            })
    }
})

let filaSeleccionada;
$("#tbdata tbody").on("click", ".btn-editar", function () {
    if ($(this).closest("tr").hasClass("child")) {
        filaSeleccionada = $(this).closest("tr").prev();
    } else {
        filaSeleccionada = $(this).closest("tr");
    }

    const data = tablaData.row(filaSeleccionada).data();

    mostrarModel(data);
})

$("#tbdata tbody").on("click", ".btn-eliminar", function () {

    let fila;
    if ($(this).closest("tr").hasClass("child")) {
        fila = $(this).closest("tr").prev();
    } else {
        fila = $(this).closest("tr");
    }

    const data = tablaData.row(fila).data();
    swal({
        title: "Esta seguro?",
        text: `Eliminar la categoria "${data.descripcion}"`,
        type: "warning",
        showCancelButton: true,
        confirmButtonClass: "btn-danger",
        cofirmButtonText: "Si, eliminar",
        cancelButtonText: "No, cancelar",
        closeOnConfirm: false,
        closeOnCancel: true
    }, function (respuesta) {
        if (respuesta) {
            $(".ShowSweetAlert").LoadingOverlay("show");

            fetch(`/Categoria/Eliminar?IdCategoria=${data.idCategoria}`, {
                method: "DELETE"
            })
                .then(response => {
                    $(".ShowSweetAlert").LoadingOverlay("hide");
                    return response.ok ? response.json() : Promise.reject(response);
                })
                .then(responseJson => {

                    if (responseJson.estado) {

                        tablaData.row(fila).remove().draw(false);
                        swal("Listo!", "La categoria fue eliminada", "success")
                    } else {
                        swal("Los Sentimos", responseJson.mensaje, "error")
                    }
                })
        }
    })
})