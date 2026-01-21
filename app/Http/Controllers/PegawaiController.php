<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePegawaiRequest;
use App\Http\Requests\UpdatePegawaiRequest;
use App\Models\Pegawai;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PegawaiController extends Controller
{
    public function index(): Response
    {
        $pegawais = Pegawai::orderBy('nama')->get();

        return Inertia::render('Pegawai/Index', [
            'pegawais' => $pegawais,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Pegawai/Create');
    }

    public function store(StorePegawaiRequest $request): RedirectResponse
    {
        Pegawai::create($request->validated());

        return redirect()->route('pegawai.index')
            ->with('success', 'Data pegawai berhasil ditambahkan');
    }

    public function show(Pegawai $pegawai): Response
    {
        return Inertia::render('Pegawai/Show', [
            'pegawai' => $pegawai,
        ]);
    }

    public function edit(Pegawai $pegawai): Response
    {
        return Inertia::render('Pegawai/Edit', [
            'pegawai' => $pegawai,
        ]);
    }

    public function update(UpdatePegawaiRequest $request, Pegawai $pegawai): RedirectResponse
    {
        $pegawai->update($request->validated());

        return redirect()->route('pegawai.index')
            ->with('success', 'Data pegawai berhasil diperbarui');
    }

    public function destroy(Pegawai $pegawai): RedirectResponse
    {
        $pegawai->delete();

        return redirect()->route('pegawai.index')
            ->with('success', 'Data pegawai berhasil dihapus');
    }
}
